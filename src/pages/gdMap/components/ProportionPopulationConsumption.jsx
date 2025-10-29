import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import MCard from '@/components/mCard';

const ProportionPopulationConsumption = () => {
    const [pieDataColor, setPieDataColor] = useState(["#17E6C3", "#40CFFF", "#1979FF", "#FFC472"])
    const [pieData, setPieData] = useState([
        {
            name: "类型1",
            value: 40,
        },
        {
            name: "类型2",
            value: 25,
        },
        {
            name: "类型3",
            value: 20,
        },
        {
            name: "类型4",
            value: 15,
        },
    ])
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                shadowStyle: { opacity: 0 },
            },
            backgroundColor: "rgba(0,0,0,1)",
            borderWidth: 1,
            borderColor: "#999999",
            textStyle: {
                color: "#ffffff",
                fontSize: 10,
            },
        },

        series: [
            {
                name: "",
                type: "pie",
                itemStyle: {
                    borderWidth: 5,
                    borderColor: "rgba(26, 57, 77,1)",
                },
                label: { show: false },
                radius: ["55%", "70%"],
                color: ["#c487ee", "#deb140", "#49dff0", "#034079", "#6f81da", "#00ffb4"],

                data: [
                    {
                        value: 40,
                        name: "类型1",
                        itemStyle: {
                            //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                { offset: 0, color: "rgba(3,65,128,1)" },
                                { offset: 1, color: "rgba(115,208,255,1)" },
                            ]),
                        },
                    },
                    {
                        value: 25,
                        name: "类型2",
                        itemStyle: {
                            //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                { offset: 0, color: "rgba(11, 77, 44, 1)" },
                                { offset: 1, color: "rgba(77, 255, 181, 1)" },
                            ]),
                        },
                    },
                    {
                        value: 20,
                        name: "类型3",
                        itemStyle: {
                            //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                { offset: 0, color: "rgba(117, 117, 117, 1)" },
                                { offset: 1, color: "rgba(230, 230, 230, 1)" },
                            ]),
                        },
                    },
                    {
                        value: 15,
                        name: "类型4",
                        itemStyle: {
                            //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                { offset: 0, color: "rgba(153, 105, 38, 1)" },
                                { offset: 1, color: "rgba(255, 200, 89, 1)" },
                            ]),
                        },
                    },
                ],
            },
        ],
    }

    useEffect(() => {
        // 初始化图表
        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption(option);

        // 响应式调整
        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.current?.dispose();
        };
    }, []);

    return (
        <div className="right-card">
            <MCard title="人群消费占比">
                <div className="population-proportion">
                    <div className="population-proportion-chart">
                        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
                        <div className="label-name">消费占比</div>
                    </div>
                    <div className="pie-legend">
                        {
                            pieData.map((item, index) => (
                                <div className="pie-legend-item" key={index}>
                                    <div className="icon" style={{ borderColor: pieDataColor[index] }}></div>
                                    <div className="name">{item.name}</div>
                                    <div className="value">
                                        {item.value}
                                        <span className="unit">%</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </MCard >
        </div >
    );
};

export default ProportionPopulationConsumption;