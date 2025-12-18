import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import "./index.scss";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import ring2 from "@/assets/texture/pie/ring2.png";
import ring3 from "@/assets/texture/pie/ring3.png";
import ring4 from "@/assets/texture/pie/ring4.png";
export default function MPie({
  data = [],
  colors = [0x20faae, 0xeab108, 0x2fa4e7, 0x00ffff, 0xfc5430],
  opacity = 0.5,
  delay = 5000,
  loopComplete = () => {},
  children,
}) {
  const pieDomRef = useRef(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [activeIndex, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);

  //Refs for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const axesRef = useRef(null);
  const pieGroupRef = useRef(new THREE.Group());
  const timerRef = useRef(null);
  const prevMeshRef = useRef(null);

  useEffect(() => {
    console.log("MPie useEffect 执行");
    if (pieDomRef.current) {
      const w = pieDomRef.current.offsetWidth;
      const h = pieDomRef.current.offsetHeight;
      const total = data.map((item) => item.value).reduce((a, b) => a + b, 0);

      console.log("设置尺寸和count:", w, h, total);
      setWidth(w);
      setHeight(h);
      setCount(total);

      // 延迟初始化，等状态更新完成
      setTimeout(() => {
        console.log("开始初始化Three.js");
        init();
      }, 0);
    }

    return () => {
      console.log("MPie 组件卸载，清理资源");
      clearInterval(timerRef.current);
      destroy();
    };
  }, []);

  const getTexture = (url) => {
    const texture = new THREE.TextureLoader().load(url);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  const createPlane = (opt) => {
    const defaultOpt = {
      url: "texture/ring1.png",
      width: 5.5,
      z: 0,
      position: new THREE.Vector3(0, 0, 0),
      animate: false,
      color: null,
    };
    const options = { ...defaultOpt, ...opt };
    const geometry = new THREE.PlaneGeometry(options.width, options.width);
    const material = new THREE.MeshBasicMaterial({
      map: getTexture(options.url),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    if (options.color) {
      material.color = new THREE.Color(options.color);
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(options.position);
    mesh.rotation.x = (-1 * Math.PI) / 2;
    if (options.animate) {
      gsap.to(mesh.rotation, {
        z: Math.PI * 2,
        repeat: -1,
        ease: "none",
        duration: 3,
      });
    }
    sceneRef.current.add(mesh);
  };

  const addRing = (opt = {}) => {
    const defaultOpt = {
      innerRadius: 1.5,
      outerRadius: 2,
      thickness: 0.5,
      startAngle: 0,
      endAngle: Math.PI / 2,
      color: 0x00ffff,
      segments: 120,
    };
    const options = { ...defaultOpt, ...opt };
    //Outer shape
    const outerShape = new THREE.Shape();
    outerShape.arc(
      0,
      0,
      options.outerRadius,
      options.startAngle,
      options.endAngle
    );
    const outerPoints = outerShape.getPoints(options.segments);
    //Inner shape
    const innerShape = new THREE.Shape();
    innerShape.arc(
      0,
      0,
      options.innerRadius,
      options.startAngle,
      options.endAngle,
      true
    );
    const innerPoints = innerShape.getPoints(options.segments);
    //Combined shape
    const shape = new THREE.Shape(outerPoints.concat(innerPoints));
    //Extrude settings
    const extrudeSettings = {
      steps: 1,
      depth: options.thickness,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 0,
    };

    const extruGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshLambertMaterial({
      color: options.color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(extruGeometry, material.clone());
    mesh.renderOrder = 10;
    mesh.rotation.x = (-1 * Math.PI) / 2;
    return mesh;
  };

  const createPie = () => {
    let startAngle = 0;
    let endAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const percent = data[i].value / count;
      if (i === 0) {
        startAngle = 0;
      } else {
        startAngle = endAngle + 0.0001;
      }
      endAngle = endAngle + 2 * Math.PI * percent - 0.0001;

      const ring = addRing({
        startAngle: startAngle,
        endAngle: endAngle,
        color: new THREE.Color(colors[i % colors.length]),
      });
      ring.name = "ring" + i;
      pieGroupRef.current.add(ring);
    }

    sceneRef.current.add(pieGroupRef.current);
    chooseRing(activeIndex, true);

    timerRef.current = setInterval(() => {
      loopChange();
    }, delay);
  };

  const loopChange = () => {
    let index = activeIndex + 1;

    if (index >= data.length) {
      index = 0;
      loopComplete();
    }
    chooseRing(index);
  };

  const chooseRing = (newIndex, isFirst = false) => {
    if (
      !pieGroupRef.current ||
      !pieGroupRef.current.children ||
      pieGroupRef.current.children.length === 0
    ) {
      return;
    }

    const prevIndex = newIndex - 1 < 0 ? data.length - 1 : newIndex - 1;
    const prevMesh = pieGroupRef.current.children[prevIndex];
    prevMeshRef.current = prevMesh;

    // 只在索引真正改变时才更新状态
    setActiveIndex((prev) => (prev === newIndex ? prev : newIndex));

    const chooseMesh = pieGroupRef.current.children[newIndex];

    if (!isFirst && prevMesh) {
      gsap.to(prevMesh.scale, { z: 1 });
      gsap.to(prevMesh.material, { opacity: opacity });
    }

    if (chooseMesh) {
      gsap.to(chooseMesh.scale, { z: 2 });
      gsap.to(chooseMesh.material, { opacity: 0.8 });
    }
  };

  const initCamera = () => {
    const rate = width / height;
    cameraRef.current = new THREE.PerspectiveCamera(30, rate, 0.1, 1500);
    cameraRef.current.position.set(
      6.023813305272227,
      4.838542633695233,
      6.111272698256137
    );
    cameraRef.current.lookAt(0, 0, 0);
  };

  const initRenderer = () => {
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setSize(width, height);
    pieDomRef.current.appendChild(rendererRef.current.domElement);
  };

  const initLight = () => {
    // Directional light 1
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(200, 300, 200);

    // Directional light 2
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2.position.set(-200, -300, -200);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);

    // Add lights to scene
    sceneRef.current.add(directionalLight1);
    sceneRef.current.add(directionalLight2);
    sceneRef.current.add(ambientLight);
  };

  const initAxes = () => {
    axesRef.current = new THREE.AxesHelper(0);
    sceneRef.current.add(axesRef.current);
  };

  const initControls = () => {
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.maxPolarAngle = Math.PI;
    controlsRef.current.autoRotate = false;
    controlsRef.current.enableDamping = true;
    controlsRef.current.enabled = false;
  };

  const loop = () => {
    rendererRef.current.setAnimationLoop(() => {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      controlsRef.current && controlsRef.current.update();
    });
  };

  const init = () => {
    sceneRef.current = new THREE.Scene();
    initCamera();
    initRenderer();
    initLight();
    initAxes();
    // initControls();

    createPlane({
      url: ring2,
      width: 5,
      position: new THREE.Vector3(0, 0, -0.01),
      color: "#00ffff",
    });

    createPlane({
      url: ring3,
      width: 6.5,
      position: new THREE.Vector3(0, 0, -0.02),
      color: "#00ffff",
    });

    createPlane({
      url: ring4,
      width: 5.5,
      position: new THREE.Vector3(0, 0, -0.03),
      animate: true,
      color: "#00ffff",
    });

    createPie();
    loop();
  };

  const start = () => {
    loop();
    controlsRef.current.enabled = true;
    timerRef.current = setInterval(() => {
      loopChange();
    }, delay);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    if (rendererRef.current) {
      rendererRef.current.setAnimationLoop(null);
    }
  };

  const resize = () => {
    const newWidth = pieDomRef.current.offsetWidth;
    const newHeight = pieDomRef.current.offsetHeight;
    setWidth(newWidth);
    setHeight(newHeight);

    const aspect = newWidth / newHeight;
    cameraRef.current.aspect = aspect;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(newWidth, newHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
  };

  const destroy = () => {
    if (prevMeshRef.current) {
      gsap.set(prevMeshRef.current.scale, { z: 1 });
      gsap.set(prevMeshRef.current.material, { opacity: opacity });
    }

    stop();
    window.removeEventListener("resize", resize);

    if (rendererRef.current) {
      // Clear pie group
      while (pieGroupRef.current.children.length > 0) {
        const child = pieGroupRef.current.children[0];
        pieGroupRef.current.remove(child);
      }

      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      controlsRef.current.dispose();
      pieDomRef.current.innerHTML = "";

      // Nullify references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      axesRef.current = null;
    }
  };

  // 计算当前显示的数据 - 使用 useMemo 避免每次渲染都创建新对象
  const itemData = React.useMemo(() => {
    if (!data || data.length === 0) return { count: 0 };
    const index = activeIndex >= data.length ? 0 : activeIndex;
    return {
      ...data[index],
      count: count,
    };
  }, [data, activeIndex, count]);

  console.log("MPie 渲染, activeIndex:", activeIndex, "count:", count);

  return (
    <div className="three-pie-wrap">
      <div className="three-pie" ref={pieDomRef} />
      <div className="three-pie-slot">
        {typeof children === "function"
          ? children({ data: itemData })
          : children}
      </div>
    </div>
  );
}
