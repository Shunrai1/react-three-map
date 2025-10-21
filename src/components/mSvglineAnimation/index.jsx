import React, { useState, useEffect } from 'react';
import './index.scss';
/**
 * SVG动画路径组件
 * @description SVG动画路径组件
 * @property {Number} width svg的宽度
 * @property {Number} height svg的高度
 * @property {String} path svg的路径值
 * @property {Number} duration 路径动画持续时间
 * @property {Number} length 路径显示的长度
 * @property {Number} begin 路径开始的位置
 * @property {Number[]} dir 路径移动方向 [0,1]-正向 [1,0]-反向
 * @property {Number} strokeWidth 路径的粗细
 * @property {String} color 路径的颜色
 */
const SvgLineAnimation = ({
    width = 135,
    height = 150,
    path = "M0 72.5H682L732 0.5H3082",
    color = "#0091FF",
    duration = 3,
    length = 100,
    begin = 0,
    dir = [0, 1],
    strokeWidth = 4,
    className = ""
}) => {
    const [maskId, setMaskId] = useState("");
    const [radialGradientId, setRadialGradientId] = useState("");

    useEffect(() => {
        // 生成唯一ID，类似于Vue的this._.uid
        const uid = Math.random().toString(36).substring(2, 9);
        setMaskId(`svgline-${uid}`);
        setRadialGradientId(`radialGradient-${uid}`);
    }, []);

    return (
        <div className={`svg-line-animation ${className}`}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient
                        id={radialGradientId}
                        cx="50%"
                        cy="50%"
                        fx="100%"
                        fy="50%"
                        r="50%"
                    >
                        <stop offset="0%" stopColor="#fff" stopOpacity={dir[1]} />
                        <stop offset="100%" stopColor="#fff" stopOpacity={dir[0]} />
                    </radialGradient>
                    <mask id={maskId}>
                        <circle
                            r={length}
                            cx="0"
                            cy="0"
                            fill={`url(#${radialGradientId})`}
                        >
                            <animateMotion
                                begin={`${begin}s`}
                                dur={`${duration}s`}
                                path={path}
                                rotate="auto"
                                keyPoints={`${dir[0]};${dir[1]}`}
                                keyTimes="0;1"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </mask>
                </defs>
                <path
                    className="path-line"
                    d={path}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    mask={`url(#${maskId})`}
                />
            </svg>
        </div>
    );
};

export default SvgLineAnimation;

// 对应的CSS可以放在单独的样式文件中，或者使用CSS-in-JS方案