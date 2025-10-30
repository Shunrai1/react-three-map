import React, { useEffect, useRef, useState } from 'react';
import '../mPie/index.scss';
import * as THREE from 'three';
import { emptyObject } from "@/mini3d";
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import ring2 from '@/assets/texture/pie/ring2.png';
import ring3 from '@/assets/texture/pie/ring3.png';
import ring4 from '@/assets/texture/pie/ring4.png';

export default function MPieFixed({
    data = [],
    colors = [0x20faae, 0xeab108, 0x2fa4e7, 0x00ffff, 0xfc5430],
    opacity = 0.5,
    delay = 5000,
    loopComplete = () => { },
    children
}) {
    const pieDomRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const pieGroupRef = useRef(new THREE.Group());
    const timerRef = useRef(null);
    const prevMeshRef = useRef(null);

    // 使用 state 存储 activeIndex，这样才能触发重新渲染和数据更新
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0); // 用于在定时器中获取最新值
    const [count, setCount] = useState(0); // 改用 state，让初始化后能触发更新

    const getTexture = (url) => {
        const texture = new THREE.TextureLoader().load(url);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    };

    const createPlane = (opt) => {
        const defaultOpt = {
            url: 'texture/ring1.png',
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
                ease: 'none',
                duration: 3
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

        const outerShape = new THREE.Shape();
        outerShape.arc(0, 0, options.outerRadius, options.startAngle, options.endAngle);
        const outerPoints = outerShape.getPoints(options.segments);

        // 内层：需要把开始结束角度调换下，并反向绘制
        const innerShape = new THREE.Shape();
        innerShape.arc(0, 0, options.innerRadius, options.endAngle, options.startAngle, true);
        const innerPoints = innerShape.getPoints(options.segments);
        // 组合内外侧的点，并重新生成shape
        const shape = new THREE.Shape(outerPoints.concat(innerPoints));

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

    const chooseRing = (newIndex, isFirst = false) => {
        if (!pieGroupRef.current || !pieGroupRef.current.children || pieGroupRef.current.children.length === 0) {
            return;
        }

        const prevIndex = newIndex - 1 < 0 ? data.length - 1 : newIndex - 1;
        const prevMesh = pieGroupRef.current.children[prevIndex];
        prevMeshRef.current = prevMesh;

        // 同时更新 ref 和 state
        activeIndexRef.current = newIndex;
        setActiveIndex(newIndex);

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

    const createPie = (total) => {
        let startAngle = 0;
        let endAngle = 0;

        for (let i = 0; i < data.length; i++) {
            const percent = data[i].value / total;
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
        chooseRing(0, true);

        timerRef.current = setInterval(() => {
            loopChange();
        }, delay);
    };

    const loopChange = () => {
        // 从 ref 中读取最新值，避免闭包陷阱
        let index = activeIndexRef.current + 1;

        if (index >= data.length) {
            index = 0;
            loopComplete();
        }
        chooseRing(index);
    };

    const initCamera = (width, height) => {
        const rate = width / height;
        cameraRef.current = new THREE.PerspectiveCamera(30, rate, 0.1, 1500);
        cameraRef.current.position.set(6.023813305272227, 4.838542633695233, 6.111272698256137);
        cameraRef.current.lookAt(0, 0, 0);
    };

    const initRenderer = (width, height) => {
        // 先清理已存在的 canvas，防止重复
        if (pieDomRef.current) {
            const existingCanvases = pieDomRef.current.querySelectorAll('canvas');
            existingCanvases.forEach(canvas => canvas.remove());
        }

        rendererRef.current = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, // 透明背景
        });
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        rendererRef.current.setSize(width, height);
        // rendererRef.current.setClearColor(0x000000, 0); // 完全透明

        const canvas = rendererRef.current.domElement;
        // canvas.style.position = 'absolute';
        // canvas.style.top = '0';
        // canvas.style.left = '0';
        // canvas.style.zIndex = '1';

        pieDomRef.current.appendChild(canvas);
    };

    const initLight = () => {
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight1.position.set(200, 300, 200);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight2.position.set(-200, -300, -200);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);

        sceneRef.current.add(directionalLight1);
        sceneRef.current.add(directionalLight2);
        sceneRef.current.add(ambientLight);
    };

    const initControls = () => {
        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
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

    const init = (width, height, total) => {
        sceneRef.current = new THREE.Scene();
        initCamera(width, height);
        initRenderer(width, height);
        initLight();
        initControls();

        // 测试对象已移除，使用正常的饼图

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

        createPie(total);
        loop();
    };

    const destroy = () => {
        if (prevMeshRef.current) {
            gsap.set(prevMeshRef.current.scale, { z: 1 });
            gsap.set(prevMeshRef.current.material, { opacity: opacity });
        }
        stop()
        // window.removeEventListener("resize", () => {
        //     resize();
        // });
        if (rendererRef.current) {
            emptyObject(pieGroupRef.current);
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss();
            controlsRef.current.dispose();
            if (pieDomRef.current) {
                pieDomRef.current.innerHTML = "";
            }
            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
        }
    };

    const stop = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (controlsRef.current) {
            controlsRef.current.enabled = false;
        }
        if (rendererRef.current) {
            rendererRef.current.setAnimationLoop(null);
        }
    }
    useEffect(() => {
        if (pieDomRef.current && data.length > 0) {
            const width = pieDomRef.current.offsetWidth;
            const height = pieDomRef.current.offsetHeight;
            const total = data.map(item => item.value).reduce((a, b) => a + b, 0);

            setCount(total); // 使用 setState，触发重新渲染
            init(width, height, total);
        };
        return () => {
            clearInterval(timerRef.current);
            destroy();
        };
    }, []);

    // 计算当前显示的数据 - 类似 Vue 的 computed
    const currentData = React.useMemo(() => {
        if (!data || data.length === 0) return { count: 0 };
        const index = activeIndex >= data.length ? 0 : activeIndex;
        return {
            ...data[index],
            count: count,
        };
    }, [activeIndex, data, count]);

    return (
        <div className="three-pie-wrap pieCanvas">
            <div className="three-pie" ref={pieDomRef} />
            <div className="three-pie-slot">
                {typeof children === 'function' ? children({ data: currentData }) : children}
            </div>
        </div>
    );
}

