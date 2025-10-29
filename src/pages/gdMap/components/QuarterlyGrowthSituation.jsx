import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import MCard from '@/components/mCard';

const QuarterlyGrowthSituation = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const option = {
        title: {
            text: "亿元",
            left: "5%",
            top: "8%",
            textStyle: {
                color: "#D3F8F2",
                fontSize: 8,
            },
        },
        grid: {
            left: "12%",
            top: "25%",
            width: "82%",
            height: "55%",
        },
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
        xAxis: [
            {
                type: "category",
                interval: 0,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#435459",
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    color: "#ffffff",
                    fontSize: 10,
                    interval: 0,
                    padding: [0, 0, 0, 0],
                },
                data: ["一季度", "二季度", "三季度", "四季度"],
            },
            {
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "rgba(0,0,0,0)",
                    },
                },
                data: [],
            },
        ],
        yAxis: {
            type: "value",

            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: [2, 2],
                    dashOffset: 5,
                    color: ["rgba(255, 255, 255, 1)"],
                    opacity: 1,
                    width: 0.3,
                },
            },
            axisLabel: {
                color: "#8B9EA4",
                fontSize: 9,
            },
        },
        series: [
            {
                name: "类型1",
                data: [100, 120, 130, 110],
                type: "bar",
                barWidth: 4,
                label: {
                    show: false,
                },
                itemStyle: {
                    borderRadius: 0,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#79EBCF" },
                        { offset: 1, color: "#0B6360" },
                    ]),
                },
            },
            {
                name: "类型2",
                data: [60, 100, 150, 90],
                type: "bar",
                barWidth: 4,
                barGap: 2,
                label: {
                    show: false,
                },
                itemStyle: {
                    borderRadius: 0,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#40AEFE" },
                        { offset: 1, color: "#25567A" },
                    ]),
                },
            },
            // {
            //   name: "",
            //   type: "bar",
            //   xAxisIndex: 1,
            //   z: 2,
            //   data: [150, 150, 150, 150],
            //   // 设置高亮样式
            //   emphasis: {
            //     focus: "none",
            //     itemStyle: { color: "rgba(255,255,255,0.8)" },
            //   },
            //   itemStyle: {
            //     color: "rgba(122,140,153,0.6)",
            //     opacity: 0.1,
            //   },
            // },
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
            <MCard title="各季度增长情况">
                <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
            </MCard>
        </div>
    );
};

export default QuarterlyGrowthSituation;