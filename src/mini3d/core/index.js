import { AxesHelper, Scene, Mesh } from "three";
import { EventEmitter, Sizes, Time } from "../utils";
import { Renderer } from "./Renderer";
import { Camera } from "./Camera";
import { geoMercator } from "d3-geo";
export class Mini3d extends EventEmitter {
  constructor(canvas, config = {}) {
    super();
    let defaultConfig = {
      isOrthographic: false,
    };
    this.config = Object.assign({}, defaultConfig, config);
    this.canvas = canvas;
    this.scene = new Scene();
    this.sizes = new Sizes(this);
    this.time = new Time(this);
    this.camera = new Camera(this, {
      isOrthographic: this.config.isOrthographic,
    });
    this.renderer = new Renderer(this);
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", (delta) => {
      this.update(delta);
    });
  }
  /**
   * 设置AxesHelper
   * @param {*} size 尺寸
   * @returns
   */
  setAxesHelper(size = 250) {
    if (!size) {
      return false;
    }
    let axes = new AxesHelper(size);
    this.scene.add(axes);
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update(delta) {
    this.camera.update(delta);
    this.renderer.update(delta);
  }
  /**
   * 销毁
   */
  destroy() {
    this.sizes.destroy();
    this.time.destroy();
    this.camera.destroy();
    this.renderer.destroy();

//     traverse 是 Three.js 中 Object3D（所有 3D 物体的基类）的一个方法。
// 功能：它会递归遍历以该对象为根节点的整个场景树（Scene Graph）。
// 作用：也就是对 this.scene 下面的每一个子物体（child）、孙物体、重孙物体……都执行一次传入的回调函数。

// 在 WebGL/Three.js 开发中，JavaScript 的垃圾回收（GC）只能回收 JS 对象本身（CPU 内存），但无法自动回收显卡（GPU）中的资源（如顶点数据、纹理图片等）。
// 如果你不调用 .dispose()，即使你把 scene = null，显存中的模型和贴图依然存在。如果用户频繁切换页面，显存会被撑爆，导致浏览器崩溃
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.canvas.parentNode.removeChild(this.canvas);
  }
}
