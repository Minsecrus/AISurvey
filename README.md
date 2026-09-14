# 生成式 AI 学习体验调查

这是一个使用 SurveyJS 构建的调查问卷页面。问卷界面可以部署在 GitHub Pages；配置 Supabase 后，回答会匿名写入 Supabase 数据表。

## 运行方式

项目不需要后端，也没有构建步骤。直接用浏览器打开 `index.html` 即可；如果浏览器限制本地文件的剪贴板能力，可以在项目目录启动一个静态服务器：

```bash
npx serve .
```

然后打开终端输出的本地地址。

## 功能

- 一页长问卷，包含基本信息、AI 使用、社会比较、学习焦虑、自我效能、AI 素养、付费意愿、情境题和开放题。
- 首题为知情同意；选择“不同意”会直接结束问卷，不生成答案文本。
- 量表题使用 SurveyJS 矩阵题，选项以大面积彩色按钮呈现，并在复制时按题号整理为纯文本。
- 问卷末尾按钮为“提交并复制答案”；点击后会尝试匿名写入 Supabase，同时复制答案文本，并显示操作结果。
- 没有配置 Supabase 时，页面仍可作为纯静态问卷使用，只复制答案，不会上传数据。

## 配置 Supabase

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，执行项目中的 `supabase-schema.sql`。
3. 在项目的 API 设置中复制 Project URL 和 publishable key；旧项目也可以使用 legacy anon key。
4. 将这两个值填入 `supabase-config.js` 的 `url` 和 `publishableKey`。
5. 发布网页后，填写者点击“提交并复制答案”，每份问卷会在 `survey_responses` 表中新增一行。

不要把 `service_role` 或 secret key 填入网页。前端公开 key 本身不是权限控制；表的访问权限由 RLS policy 决定。

## 依赖

SurveyJS 通过 CDN 加载：

- `survey-core`
- `survey-js-ui`

如果需要完全离线部署，可以将这两个依赖下载到本地，再把 `index.html` 中的 CDN 地址替换为本地路径。
