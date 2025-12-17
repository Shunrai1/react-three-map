import React from 'react'
import { useRef, useEffect } from 'react';
import emitter from "@/utils/emitter";

export default function MapScene() {
    const canvasMap = useRef(null);
    useEffect(() => {

    }, [])

    function loadMap(assets) {
        // canvasMap.current =
    }
    return (
        <div className="map">
            <canvas id="canvasMap"></canvas>
        </div>
    )
}
