import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { World } from "./map.js";
import emitter from "@/utils/emitter";

const MapScene = forwardRef((props, ref) => {
    const canvasMap = useRef(null);

    useImperativeHandle(ref, () => ({
        play
    }));

    useEffect(() => {
        emitter.$on("loadMap", loadMap);
        return () => {
            canvasMap.current && canvasMap.current.destroy();
            emitter.$off("loadMap", loadMap);
        }
    }, [])

    async function play() {
        if (canvasMap.current) {
            canvasMap.current.time.resume();
            canvasMap.current.animateTl.timeScale(1); // 设置播放速度正常
            canvasMap.current.animateTl.play();
        }
    }

    function loadMap(assets) {
        canvasMap.current = new World(document.getElementById("canvasMap"), assets);
        canvasMap.current.time.pause();
    }
    return (
        <div className="map">
            <canvas id="canvasMap"></canvas>
        </div>
    )
})

export default MapScene;
