# 唯客 AI 护栏 - 前后端对接指南

本文档旨在帮助后台开发人员快速了解如何将现有后台与此前端项目进行集成。

## 1. 环境配置

前端使用 Vite 构建，API 地址通过环境变量管理。

在项目根目录创建或修改 `.env` 文件：
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

## 2. 核心接口清单 (API Endpoints)

目前前端预留了以下交互点，建议后台按此规范提供接口：

### A. 提交联系申请
*   **URL**: `/contact`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "name": "姓名",
      "email": "邮箱",
      "company": "公司名称",
      "jobTitle": "职位",
      "needs": "具体需求描述"
    }
    ```
*   **Response**: 标准 JSON 响应 `{ "code": 200, "message": "success", "data": null }`

### B. 动态内容 (可选)
如果需要后台管理以下内容，可提供 GET 接口：
*   `/changelog`: 返回更新日志列表
*   `/posts`: 返回新闻博客列表
*   `/roadmap`: 返回技术路线图数据

## 3. 跨域处理 (CORS)

如果前端部署域名与后台不同，请确保后台开启了 CORS 支持，允许来自前端域名的请求。

## 4. 前端代码结构参考

*   **类型定义**: `src/types/api.ts` (定义了所有交互的数据模型)
*   **请求逻辑**: `src/services/api.ts` (封装了所有的 fetch 请求)
*   **组件调用**: 搜索 `apiService` 关键字即可找到前端调用接口的位置。

---
*如有疑问，请联系前端开发团队。*
