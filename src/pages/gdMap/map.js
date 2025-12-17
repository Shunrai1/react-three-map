import {
  Fog,
  Group,
  MeshBasicMaterial,
  DirectionalLight,
  AmbientLight,
  PointLight,
  Vector3,
  MeshLambertMaterial,
  LineBasicMaterial,
  Color,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  AdditiveBlending,
  VideoTexture,
  NearestFilter,
  BoxGeometry,
  TubeGeometry,
  QuadraticBezierCurve3,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  CustomBlending,
  AddEquation,
  DstColorFactor,
  OneFactor,
} from "three";

import {
  Mini3d,
  ExtrudeMap,
  BaseMap,
  Line,
  Grid,
  Label3d,
  Plane,
  Particles,
  GradientShader,
  DiffuseShader,
  Focus,
} from "@/mini3d";

import { geoMercator } from "d3-geo";
import labelIcon from "@/assets/texture/label-icon.png";
import chinaData from "./map/chinaData";
import provincesData from "./map/provincesData";
import scatterData from "./map/scatter";
import infoData from "./map/infoData";
import gsap from "gsap";
import emitter from "@/utils/emitter";
import { InteractionManager } from "three.interactive";
function sortByValue(data) {
  data.sort((a, b) => b.value - a.value);
  return data;
}

export class World extends Mini3d {
  constructor(canvas, assets) {
    super(canvas);
    // 中心坐标
    this.geoProjectionCenter = [113.280637, 23.125178];
    // 缩放比例
    this.geoProjectionScale = 120;
    // 飞线中心
    this.flyLineCenter = [113.544372, 23.329249];
    // 地图拉伸高度
    this.depth = 0.5;
    this.mapFocusLabelInfo = {
      name: "广东省",
      enName: "GUANGDONG PROVINCE",
      center: [113.280637, 20.625178],
    };
    // 是否点击
    this.clicked = false;
    // 雾
    this.scene.fog = new Fog(0x102736, 1, 50);
    // 背景
    this.scene.background = new Color(0x102736);
    // 相机初始位置
    this.camera.instance.position.set(
      -13.767695123014105,
      12.990152163077308,
      39.28228164159694
    );
    this.camera.instance.near = 1;
    this.camera.instance.far = 10000;
    this.camera.instance.updateProjectionMatrix();
    // 创建交互管理
    this.interactionManager = new InteractionManager(
      this.renderer.instance,
      this.camera.instance,
      this.canvas
    );
    this.assets = assets;
    // 创建环境光
    this.initEnvironment();
    this.init();
  }

  initEnvironment() {
    let sun = new AmbientLight(0xffffff, 5);
    this.scene.add(sun);
    let directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(-30, 6, -8);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 20;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);
    this.createPointLight({
      color: "#1d5e5e",
      intensity: 800,
      distance: 10000,
      x: -9,
      y: 3,
      z: -3,
    });
    this.createPointLight({
      color: "#1d5e5e",
      intensity: 200,
      distance: 10000,
      x: 0,
      y: 2,
      z: 5,
    });
  }

  createPointLight(pointParams) {
    const pointLight = new PointLight(
      0x1d5e5e,
      pointParams.intensity,
      pointParams.distance
    );
    pointLight.position.set(pointParams.x, pointParams.y, pointParams.z);
    this.scene.add(pointLight);
  }
}
