// 飞书集成模块
const axios = require('axios');

/**
 * 发送消息到飞书机器人
 * @param {string} webhookUrl - 飞书webhook URL
 * @param {Object} message - 消息内容
 * @returns {Promise<boolean>} 是否发送成功
 */
async function sendToFeishuBot(webhookUrl, message) {
  if (!webhookUrl) {
    console.log('未配置飞书Webhook，跳过发送');
    return false;
  }

  try {
    const response = await axios.post(webhookUrl, {
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: message.title || '新消息通知'
          },
          template: 'blue'
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: message.content || ''
            }
          }
        ]
      }
    });

    if (response.data.StatusCode === 0 || response.data.code === 0) {
      console.log('✓ 飞书消息发送成功');
      return true;
    } else {
      console.error('飞书消息发送失败:', response.data);
      return false;
    }
  } catch (error) {
    console.error('发送到飞书失败:', error.message);
    return false;
  }
}

/**
 * 同步数据到飞书表格
 * @param {Object} config - 配置信息
 * @param {Object} data - 要同步的数据
 * @returns {Promise<boolean>} 是否同步成功
 */
async function syncToFeishuTable(config, data) {
  // 支持两种配置结构：嵌套和扁平
  const feishuConfig = config.feishuConfig || {};
  const appId = config.feishuAppId || feishuConfig.appId;
  const appSecret = config.feishuAppSecret || feishuConfig.appSecret;
  const tableUrl = config.feishuTableUrl || feishuConfig.tableUrl;
  const tableId = feishuConfig.tableId;
  const tableSheetId = feishuConfig.tableSheetId;
  
  // 如果没有tableId，尝试从tableUrl中提取
  let baseId = tableId;
  let sheetId = tableSheetId;
  
  if (!baseId && tableUrl) {
    // 从URL中提取base ID和table ID
    // URL格式: https://xxx.feishu.cn/base/{baseId}?table={tableId}&view={viewId}
    const baseMatch = tableUrl.match(/\/base\/([^?]+)/);
    const tableMatch = tableUrl.match(/[?&]table=([^&]+)/);
    
    if (baseMatch) baseId = baseMatch[1];
    if (tableMatch) sheetId = tableMatch[1];
  }
  
  if (!appId || !appSecret || !baseId || !sheetId) {
    console.log('飞书表格配置不完整，跳过同步');
    console.log('appId:', appId ? '已配置' : '未配置');
    console.log('appSecret:', appSecret ? '已配置' : '未配置');
    console.log('baseId:', baseId || '未配置');
    console.log('sheetId:', sheetId || '未配置');
    return false;
  }

  // 每个规范字段允许多个列名（中/英 + 别名），按顺序尝试匹配表格实际列名。
  // 用户新建的飞书多维表格字段名不一定跟原始版本一致——我们先拉一次列定义，
  // 把数据字段 key 对齐到表格里真正存在的列名，避免 FieldNameNotFound 直接失败。
  const FIELD_ALIASES = {
    name:       ['姓名', '联系人', '客户姓名', 'name', 'Name'],
    company:    ['公司/学校/机构', '公司', '机构', '学校', '企业', 'company', 'Company', 'organization'],
    phone:      ['手机号码', '手机号', '电话', 'phone', 'Phone', 'mobile'],
    email:      ['电子邮箱', '邮箱', 'email', 'Email'],
    message:    ['咨询需求', '留言', '需求', '备注', 'message', 'Message', 'notes'],
    source:     ['来源', '来源渠道', 'source', 'Source'],
    url:        ['网址', '站点', '来源 URL', 'url', 'URL'],
    date:       ['日期', '提交时间', '时间', 'date', 'Date', 'timestamp'],
    deviceType: ['客户端类型', '设备', '设备类型', 'device', 'Device'],
  };

  try {
    // 获取tenant_access_token
    const tokenResponse = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: appId,
      app_secret: appSecret
    });

    if (tokenResponse.data.code !== 0) {
      throw new Error('获取飞书access token失败: ' + tokenResponse.data.msg);
    }

    const accessToken = tokenResponse.data.tenant_access_token;

    // 先查表格实际字段列表，再用别名匹配——用户可以用任意列名建新表格。
    let tableFieldNames = null;
    try {
      const fieldsResp = await axios.get(
        `https://open.feishu.cn/open-apis/bitable/v1/apps/${baseId}/tables/${sheetId}/fields?page_size=100`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (fieldsResp.data.code === 0) {
        tableFieldNames = (fieldsResp.data.data?.items || []).map(f => f.field_name);
      }
    } catch (e) {
      console.warn('[feishu] 读取表格字段失败，退回到默认列名:', e.message);
    }

    // 为每个数据键挑选"表格里存在的"那个列名；实在没匹配就跳过该键，避免整单失败。
    const pickFieldName = (key) => {
      const aliases = FIELD_ALIASES[key] || [];
      if (!tableFieldNames) return aliases[0];
      return aliases.find(a => tableFieldNames.includes(a)) || null;
    };

    const record = {};
    const entries = {
      name:       data.name || '',
      company:    data.school || data.company || '',
      phone:      data.phone || '',
      email:      data.email || '',
      message:    data.message || '',
      source:     data.source || 'website',
      url:        data.url || '',
      date:       data.timestamp || data.submittedAt || new Date().toISOString(),
      deviceType: data.deviceType || '未知',
    };
    for (const [key, value] of Object.entries(entries)) {
      const fieldName = pickFieldName(key);
      if (fieldName) record[fieldName] = value;
    }

    if (Object.keys(record).length === 0) {
      console.error('[feishu] 表格字段与留言字段完全不匹配，跳过写入。表格字段：', tableFieldNames);
      return false;
    }

    // 添加记录到表格
    const recordResponse = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${baseId}/tables/${sheetId}/records`,
      { fields: record },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (recordResponse.data.code === 0) {
      console.log('✓ 同步到飞书表格成功');
      return true;
    } else {
      throw new Error('同步失败: ' + JSON.stringify(recordResponse.data));
    }

  } catch (error) {
    console.error('同步到飞书表格失败:', error.response?.data || error.message);
    return false;
  }
}

module.exports = {
  sendToFeishuBot,
  syncToFeishuTable
};
