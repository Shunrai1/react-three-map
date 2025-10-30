import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import "~@/assets/style/home.scss";
import autofit from "autofit.js";
import MHeader from "@/components/mHeader";
import MMenu from "@/components/mMenu";
import MMenuItem from "@/components/mMenuItem";
import MCountCard from "@/components/mCountCard";
import BulkCommoditySalesChart from "./components/BulkCommoditySalesChart";
import YearlyEconomyTrend from "./components/YearlyEconomyTrend";
import EconomicTrendChart from "./components/EconomicTrendChart";
import DistrictEconomicIncome from "./components/DistrictEconomicIncome";
import PurposeSpecialFunds from "./components/PurposeSpecialFunds";
import ProportionPopulationConsumption from "./components/ProportionPopulationConsumption";
import ElectricityUsage from "./components/ElectricityUsage";
import QuarterlyGrowthSituation from "./components/QuarterlyGrowthSituation";
import './components/index.scss';
import SvgLineAnimation from '@/components/mSvglineAnimation';
import arrowBig from '@/assets/images/bottom-menu-arrow-big.svg';
import arrowSmall from '@/assets/images/bottom-menu-arrow-small.svg';
import MRadar from '@/components/mRadar';
// import { Assets } from "./assets.js";

const GdMap = (props) => {
  const assets = useRef();

  // 定义响应式状态
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState("1");
  const [totalView, setTotalView] = useState([
    {
      icon: "xiaoshoujine",
      zh: "2024年生产总值",
      en: "Gross Domestic Product in 2024",
      value: 31500,
      unit: "亿元",
    },
    {
      icon: "zongxiaoliang",
      zh: "2024年常驻人数",
      en: "resident population in 2024",
      value: 15000,
      unit: "万人",
    },
  ]);

  function handleMenuSelect(index) {
    setActiveIndex(index);
  }

  //   // 初始化加载资源
  // function initAssets(onLoadCallback) {
  //   assets.value = new Assets();
  //   // 资源加载进度
  //   let params = {
  //     progress: 0,
  //   };
  //   assets.value.instance.on("onProgress", (path, itemsLoaded, itemsTotal) => {
  //     let p = Math.floor((itemsLoaded / itemsTotal) * 100);
  //     gsap.to(params, {
  //       progress: p,
  //       onUpdate: () => {
  //         state.progress = Math.floor(params.progress);
  //       },
  //     });
  //   });
  //   // 资源加载完成
  //   assets.value.instance.on("onLoad", () => {
  //     onLoadCallback && onLoadCallback();
  //   });
  // }
  // 相当于 Vue 的 onMounted
  useEffect(() => {
    // 在这里写组件挂载后执行的代码
    assets.current = autofit.init({
      dh: 1080,
      dw: 1920,
      el: "#large-screen",
      resize: true,
    });

    // 如果需要在组件卸载时执行清理操作（相当于 Vue 的 onUnmounted）
    return () => {
      autofit.off()
    };
  }, []); // 空数组表示只在组件挂载时执行一次

  return <div className="large-screen">
    <div className="large-screen-wrap" id="large-screen">
      <MHeader
        title="广东省数据可视化平台"
        subText="Guangdong Economic Visualization Platform"
        leftSlot={<div className="m-header-weather"><span>小雨</span><span>27℃</span></div>}
        rightSlot={<div className="m-header-date"><span>2023-10-12</span><span>17:53:16</span></div>}
      />
      {/* 顶部菜单  */}
      <div className="top-menu">
        <MMenu defaultIndex={activeIndex} onSelect={handleMenuSelect}>
          <MMenuItem index="1">经济概览</MMenuItem>
          <MMenuItem index="2">导航栏</MMenuItem>
          <MMenuItem index="3">导航栏</MMenuItem>
          <div className="top-menu-mid-space"></div>
          <MMenuItem index="4">导航栏</MMenuItem>
          <MMenuItem index="5">导航栏</MMenuItem>
          <MMenuItem index="6">导航栏</MMenuItem>
        </MMenu>
      </div>
      {/* 顶部统计卡片 */}
      <div className="top-count-card">
        {
          totalView.map((item, index) => {
            return <MCountCard key={index} info={item} />
          })
        }
      </div>
      {/* 左边布局 图表  */}
      <div className="left-wrap">
        <div className="left-wrap-3d">
          {/* 大宗商品销售额 */}
          <BulkCommoditySalesChart />
          {/* 年度经济增长点 */}
          <YearlyEconomyTrend />
          {/* 近年经济情况 */}
          <EconomicTrendChart />
          {/* 各区经济收益 */}
          <DistrictEconomicIncome />
        </div>
      </div>
      {/* 右边布局 图表 */}
      <div className="right-wrap">
        <div className="right-wrap-3d">
          {/* 专项资金用途  */}
          <PurposeSpecialFunds />
          {/* 人群消费占比  */}
          <ProportionPopulationConsumption />
          {/* 用电情况  */}
          <ElectricityUsage />
          {/* 各季度增长情况  */}
          <QuarterlyGrowthSituation />
        </div>
      </div>

      {/* 底部托盘 */}
      <div className="bottom-tray">
        {/* svg线条动画 */}
        <SvgLineAnimation className="bottom-svg-line-left"
          width={721}
          height={57}
          color="#30DCFF"
          strokeWidth={2}
          dir={[0, 1]}
          length={50}
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142">
        </SvgLineAnimation>
        <SvgLineAnimation className="bottom-svg-line-right"
          width={721}
          height={57}
          color="#30DCFF"
          strokeWidth={2}
          dir={[0, 1]}
          length={50}
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142">
        </SvgLineAnimation>
        {/* 做箭头 */}
        <div className="bottom-tray-arrow">
          <img src={arrowBig} alt="" />
          <img src={arrowSmall} alt="" />
        </div>
        {/* 底部菜单 */}
        <div className="bottom-menu">
          <div className="bottom-menu-item is-active"><span>人口概览</span></div>
          <div className="bottom-menu-item"><span>小标题</span></div>
          <div className="bottom-menu-item"><span>小标题</span></div>
          <div className="bottom-menu-item"><span>小标题</span></div>
        </div>
        {/* 右箭头 */}
        <div className="bottom-tray-arrow is-reverse">
          <img src={arrowBig} alt="" />
          <img src={arrowSmall} alt="" />
        </div>
      </div>

      {/* 雷达 */}
      <div className="bottom-radar">
        <MRadar></MRadar>
      </div>

      {/* 左右装饰线 */}
      <div className="large-screen-left-zsline"></div>
      <div className="large-screen-right-zsline"></div>
    </div>
  </div>;
};

export default GdMap;
