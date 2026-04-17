#!/usr/bin/env node
/**
 * 一次性迁移脚本：把历史文章 content 里残留的 markdown 转成 HTML。
 *
 * 用法（在服务器 /var/www/audit/backend/ 下）：
 *   node migrate-articles-markdown.js              # dry-run，只报告需要修复的文章
 *   node migrate-articles-markdown.js --apply      # 真正写回文件（自动备份）
 *
 * 检测规则：content 中出现以下任一 markdown 标记即视为需修复
 *   1. 行首 #/##/### + 空格
 *   2. 行首 -/* + 至少一个空格（列表）
 *   3. 未配对的 **...** 粗体（HTML 中只会出现在 <strong> 包起来的情况）
 *   4. 内容以 "改写后的文本:" 之类 LLM 前言开头
 */

const fs = require('fs');
const path = require('path');
const { markdownToHtml, cleanHtml, cleanTitle } = require('./article-rewriter');

const DATA_DIR = path.join(__dirname, 'data');
const MAIN_FILE = path.join(DATA_DIR, 'articles.json');
const SITES_DIR = path.join(DATA_DIR, 'sites');

const APPLY = process.argv.includes('--apply');

/** 标题里不应出现任何 markdown 或 HTML 标签 */
function titleNeedsFix(title) {
  if (!title) return false;
  return /\*\*[^*\n]+?\*\*|__[^_\n]+?__|^#{1,6} |<\/?[a-z]/i.test(title);
}

/** 内容里任何一处 markdown 残留都算需修复（严格模式，不再用 bold>strong 启发式） */
function contentNeedsFix(content) {
  if (!content) return false;
  // 行首标题 #/##/### (3 个或更少)
  if (/(^|\n)#{1,3} +\S/.test(content)) return true;
  // 行首列表
  if (/(^|\n)[*\-] {1,3}\S/.test(content)) return true;
  // 任何一处裸 **bold**（排除 HTML 属性、相邻 * 标记）
  if (/\*\*[^*<>\n]{1,200}?\*\*/.test(content)) return true;
  // LLM 前言泄漏
  if (/^\s*(?:改写后的文本|改写后的文章|改写结果|以下是改写后的|Here(?:'|')?s?\s+the\s+rewritten|Rewritten)/i.test(content)) return true;
  return false;
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function backupFile(file) {
  const bak = file + '.backup.' + Date.now();
  fs.copyFileSync(file, bak);
  return bak;
}

function processFile(file) {
  if (!fs.existsSync(file)) return null;
  const arr = loadJson(file);
  if (!Array.isArray(arr)) return null;
  const fixes = [];
  for (const art of arr) {
    if (!art) continue;
    const fixFields = [];

    if (typeof art.title === 'string' && titleNeedsFix(art.title)) {
      const newTitle = cleanTitle(art.title);
      fixFields.push({ field: 'title', before: art.title, after: newTitle });
      if (APPLY) art.title = newTitle;
    }

    if (typeof art.content === 'string' && contentNeedsFix(art.content)) {
      const before = art.content;
      const cleaned = cleanHtml(before);
      const converted = markdownToHtml(cleaned);
      fixFields.push({
        field: 'content',
        before: before.slice(0, 120).replace(/\s+/g, ' '),
        after: converted.slice(0, 120).replace(/\s+/g, ' '),
        beforeLen: before.length,
        afterLen: converted.length,
      });
      if (APPLY) art.content = converted;
    }

    if (fixFields.length) fixes.push({ id: art.id, fields: fixFields });
  }
  if (APPLY && fixes.length > 0) {
    const bak = backupFile(file);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    return { file, fixes, backup: bak };
  }
  return { file, fixes };
}

function main() {
  const targets = [MAIN_FILE];
  if (fs.existsSync(SITES_DIR)) {
    for (const site of fs.readdirSync(SITES_DIR)) {
      const f = path.join(SITES_DIR, site, 'articles.json');
      if (fs.existsSync(f)) targets.push(f);
    }
  }

  let totalFixes = 0;
  for (const t of targets) {
    const res = processFile(t);
    if (!res) continue;
    if (res.fixes.length === 0) {
      console.log(`[OK]    ${path.relative(DATA_DIR, t)} — no changes needed`);
      continue;
    }
    totalFixes += res.fixes.length;
    console.log(`\n[${APPLY ? 'FIXED' : 'TODO '}] ${path.relative(DATA_DIR, t)} — ${res.fixes.length} article(s)`);
    if (res.backup) console.log(`         backup: ${path.basename(res.backup)}`);
    for (const f of res.fixes) {
      console.log(`  - id=${f.id}`);
      for (const ff of f.fields) {
        if (ff.field === 'title') {
          console.log(`    [title]   ${ff.before}`);
          console.log(`           →  ${ff.after}`);
        } else {
          console.log(`    [content] ${ff.beforeLen} → ${ff.afterLen} chars`);
          console.log(`      BEFORE: ${ff.before}`);
          console.log(`      AFTER:  ${ff.after}`);
        }
      }
    }
  }

  console.log(`\n${APPLY ? '✅ Applied' : '📋 Dry-run'}: ${totalFixes} article(s) ${APPLY ? 'converted' : 'need conversion'}.`);
  if (!APPLY && totalFixes > 0) {
    console.log(`\nRe-run with --apply to write changes.`);
  }
}

main();
