# 言侦公寓 · 언진 아파트

八人侦探团角色设定网站。纯静态页面，无框架、无构建步骤，直接上传即可用 GitHub Pages 打开。

## 目录

```
index.html            页面结构
assets/
  data.js             全部角色文案（中文原文 + 韩文副标）
  css/style.css       样式与动效
  js/app.js           交互（卡片 3D、粒子、详情弹层、灯箱、键盘切换）
  chars/*.webp        八个人物立绘（已去白底，透明）
  gallery/*.jpg       设计原稿
  hero.jpg / hero.mp4 封面图与动态封面视频
```

## 做了什么

- 封面：hero.mp4 动态推移背景 + Canvas 尘埃粒子 + 标题逐字入场 + 光标光晕 + 视差
- 世界观：六段原文，关键词高亮，滚动逐段浮现
- 角色档案：八张卡，鼠标移动带 3D 倾斜与光斑，点击进入全屏档案
- 角色档案详情：左立绘右资料，分「身份 / 外貌 / 性格 / 异能 / 内核 / 运营 / 设定细节」七组，中韩双语标题，分组导航随滚动高亮
- 设计原稿：点击放大灯箱
- 快捷键：详情页 ← → 切换角色，Esc 关闭
- 响应式：手机两列、平板三列、桌面四列

## 怎么上传到 GitHub Pages

1. 在 GitHub 新建仓库，比如 `yanzhen-apartment`，选 Public
2. 把这个文件夹里的**全部内容**上传（index.html 要在仓库根目录）
   - 网页端：Add file → Upload files，把 index.html 和 assets 文件夹一起拖进去
   - 或命令行：
     ```
     git init
     git add .
     git commit -m "言侦公寓 角色设定站"
     git branch -M main
     git remote add origin https://github.com/你的用户名/yanzhen-apartment.git
     git push -u origin main
     ```
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，Branch 选 `main` / `root`，保存
4. 等一两分钟，访问 `https://你的用户名.github.io/yanzhen-apartment/`

本地预览：双击 index.html 即可（无需服务器）。

## 说明

全部文字与图像素材来自课程作业原稿，页面仅做展示与排版。
