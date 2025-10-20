import React, { useEffect } from "react";
import "./index.scss";
import "~@/assets/style/home.scss";
import autofit from "autofit.js";

const GdMap = (props) => {
  // 相当于 Vue 的 onMounted
  useEffect(() => {
    // 在这里写组件挂载后执行的代码
    autofit.init({
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
    
    </div>
  </div>;
};

export default GdMap;
