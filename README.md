# 广东省数据可视化平台 (Guangdong Economic Visualization Platform)

这是一个基于 React 和 Three.js 构建的 3D 数据可视化大屏项目，展示了广东省的经济、人口等关键数据指标。项目集成了 3D 地图交互、ECharts 图表分析以及丰富的动态视觉效果。

![系统截图](./public/info.gif)

## 🛠 技术栈

- **核心框架**: React 19
- **构建工具**: Vite
- **3D 引擎**: Three.js (基于 `src/mini3d` 进行二次封装)
- **动画引擎**: GSAP (处理复杂的场景运镜和时间轴动画)
- **图表库**: ECharts
- **地理投影**: d3-geo
- **大屏适配**: autofit.js
- **样式预处理**: SCSS / TailwindCSS

## ✨ 功能特性

- **沉浸式 3D 地图**:
  - 广东省行政区划的 3D 模型渲染与拉伸效果。
  - 支持地图钻取、视角切换与自动巡航。
  - 动态材质效果（流光、渐变、雾化）。
- **丰富的视觉动效**:
  - **飞线动画 (FlyLine)**: 展示城市间的流动数据。
  - **粒子系统 (Particles)**: 氛围渲染。
  - **动态标注 (Label3d)**: 基于 CSS3D 的 HTML 标签，跟随 3D 坐标移动。
  - **聚焦光圈 (Focus)**: 高亮显示重点区域。
- **数据可视化组件**:
  - 包含各类 ECharts 图表（折线图、饼图、雷达图等）展示经济趋势、人口占比等数据。
- **全屏幕自适应**: 针对 1920x1080 设计稿进行自动缩放适配。

## 📂 核心目录结构

```
src/
├── assets/           # 静态资源（纹理贴图、字体、SVG图标）
├── components/       # 通用 UI 组件（头部、菜单、通用卡片）
├── mini3d/           # Three.js 封装库
│   ├── core/         # 核心类（Scene, Camera, Renderer）
│   ├── components/   # 3D 物体组件（BaseMap, FlyLine, Label3d, Focus 等）
│   └── shader/       # 自定义着色器（GradientShader, DiffuseShader）
├── pages/
│   └── gdMap/        # 核心大屏页面
│       ├── map.js    # 地图场景构建逻辑（主要业务代码）
│       ├── components/ # 具体的业务图表组件
│       └── map/      # 地图 GeoJSON 数据
└── utils/            # 工具函数
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
# 或者
npm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 构建生产版本

```bash
pnpm build
```
