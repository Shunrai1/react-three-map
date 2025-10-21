import React, { useEffect, useRef } from "react";
import "./index.scss";
import "~@/assets/style/home.scss";
import autofit from "autofit.js";
import MHeader from "@/components/mHeader";
// import { Assets } from "./assets.js";

const GdMap = (props) => {
  const assets = useRef();



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
    </div>
  </div>;
};

export default GdMap;
