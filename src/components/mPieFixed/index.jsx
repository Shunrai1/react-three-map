import React, { useEffect, useRef } from 'react';
import '../mPie/index.scss';
import * as THREE from 'three';
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

    // 使用 ref 存储状态，避免触发重新渲染
    const activeIndexRef = useRef(0);
    const countRef = useRef(0);

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

        const innerShape = new THREE.Shape();
        innerShape.arc(0, 0, options.innerRadius, options.startAngle, options.endAngle, true);
        const innerPoints = innerShape.getPoints(options.segments);

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

        // 直接更新 ref，不触发重新渲染
        activeIndexRef.current = newIndex;

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

    const createPie = () => {
        let startAngle = 0;
        let endAngle = 0;

        for (let i = 0; i < data.length; i++) {
            const percent = data[i].value / countRef.current;
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
        rendererRef.current = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, // 透明背景
        });
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        rendererRef.current.setSize(width, height);
        rendererRef.current.setClearColor(0x000000, 0); // 完全透明

        const canvas = rendererRef.current.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';

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
        const animate = () => {
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
                return;
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            controlsRef.current && controlsRef.current.update();

            requestAnimationFrame(animate);
        };

        animate();
    };

    const init = (width, height) => {
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

        createPie();
        loop();
    };

    const destroy = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (pieDomRef.current && rendererRef.current.domElement && pieDomRef.current.contains(rendererRef.current.domElement)) {
                pieDomRef.current.removeChild(rendererRef.current.domElement);
            }
        }
        if (sceneRef.current) {
            sceneRef.current.clear();
        }
    };

    useEffect(() => {
        if (pieDomRef.current && data.length > 0) {
            const width = pieDomRef.current.offsetWidth || 300;
            const height = pieDomRef.current.offsetHeight || 200;
            const total = data.map(item => item.value).reduce((a, b) => a + b, 0);

            countRef.current = total;
            init(width, height);
        }

        return () => {
            destroy();
        };
    }, []);

    // 计算当前显示的数据
    const currentData = React.useMemo(() => {
        if (!data || data.length === 0) return { count: 0 };
        const index = activeIndexRef.current >= data.length ? 0 : activeIndexRef.current;
        return {
            ...data[index],
            count: countRef.current,
        };
    }, [data]);

    return (
        <div className="three-pie-wrap">
            <div className="three-pie" ref={pieDomRef} />
            <div className="three-pie-slot">
                {typeof children === 'function' ? children({ data: currentData }) : children}
            </div>
        </div>
    );
}

