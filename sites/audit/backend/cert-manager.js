// SSL证书管理模块 — 远程检查所有站点域名的证书状态
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// 所有需要检查的域名
const ALL_DOMAINS = [
  { domain: 'audit.jotoai.com', name: '唯客智审' },
  { domain: 'shanyue.jotoai.com', name: '闪阅' },
  { domain: 'sec.jotoai.com', name: '唯客 AI 护栏' },
  { domain: 'kb.jotoai.com', name: '唯客知识中台' },
  { domain: 'fasium.jotoai.com', name: 'FasiumAI' },
  { domain: 'loop.jotoai.com', name: 'Loop' },
  { domain: 'note.jotoai.com', name: 'Noteflow' },
  { domain: 'admin.jotoai.com', name: 'Admin' },
];

/**
 * 检查单个域名的SSL证书
 * @param {string} domain
 * @returns {Promise<Object>}
 */
async function checkDomainCert(domain) {
  try {
    const cmd = `echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null`;
    const { stdout } = await execPromise(cmd, { timeout: 10000 });

    const notAfterMatch = stdout.match(/notAfter=(.+)/);
    const notBeforeMatch = stdout.match(/notBefore=(.+)/);

    if (notAfterMatch) {
      const expiryDate = new Date(notAfterMatch[1]);
      const startDate = notBeforeMatch ? new Date(notBeforeMatch[1]) : null;
      const now = new Date();
      const daysLeft = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

      return {
        domain,
        expiry: expiryDate.toISOString().split('T')[0],
        issued: startDate ? startDate.toISOString().split('T')[0] : '-',
        daysLeft,
        status: daysLeft > 30 ? 'ok' : daysLeft > 7 ? 'warning' : 'critical',
      };
    }

    return { domain, expiry: '-', issued: '-', daysLeft: 0, status: 'error', error: '无法解析证书' };
  } catch (err) {
    return { domain, expiry: '-', issued: '-', daysLeft: 0, status: 'error', error: err.message };
  }
}

/**
 * 获取所有站点的SSL证书状态
 * @returns {Promise<Object>}
 */
async function getSSLStatus() {
  try {
    const results = await Promise.all(
      ALL_DOMAINS.map(async ({ domain, name }) => {
        const cert = await checkDomainCert(domain);
        return { ...cert, name };
      })
    );

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 检查自动续订状态
 */
async function checkAutoRenewStatus() {
  try {
    const { stdout } = await execPromise('crontab -l 2>/dev/null || echo ""');
    return stdout.includes('certbot renew');
  } catch {
    return false;
  }
}

/**
 * 续订SSL证书
 */
async function renewSSL() {
  try {
    const { stdout, stderr } = await execPromise('sudo certbot renew --force-renewal', { timeout: 120000 });

    try {
      await execPromise('sudo systemctl reload nginx');
    } catch (nginxError) {
      console.error('Failed to reload nginx:', nginxError.message);
    }

    return { success: true, message: 'SSL证书续订成功' };
  } catch (error) {
    return { success: false, error: '证书续订失败: ' + error.message };
  }
}

/**
 * 设置自动续订
 */
async function setAutoRenew(enabled) {
  try {
    let currentCrontab = '';
    try {
      const { stdout } = await execPromise('crontab -l 2>/dev/null || echo ""');
      currentCrontab = stdout;
    } catch {}

    const lines = currentCrontab.split('\n').filter(line => !line.includes('certbot renew'));

    if (enabled) {
      lines.push('0 2 * * * certbot renew --quiet && systemctl reload nginx');
    }

    await execPromise(`echo "${lines.join('\n')}" | crontab -`);
    return { success: true, message: enabled ? '自动续订已启用' : '自动续订已关闭' };
  } catch (error) {
    return { success: false, error: '设置自动续订失败: ' + error.message };
  }
}

// Legacy compatibility
async function renewCertificate() { return renewSSL(); }
async function getCertificateInfo() { return getSSLStatus(); }

module.exports = {
  getSSLStatus,
  renewSSL,
  setAutoRenew,
  renewCertificate,
  getCertificateInfo,
};
