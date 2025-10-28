import React, { useState, useRef } from 'react';
import MCard from '@/components/mCard';
import MPieFixed from '@/components/mPieFixed';
import MCountTo from '@/components/mCountTo';

const YearlyEconomyTrend = () => {
    const pieRef = useRef(null);
    const [state] = useState({
        pieDataColor: ["#17E6C3", "#40CFFF", "#1979FF", "#FFC472"],
        pieData: [
            {
                name: "类型1",
                value: 400,
            },
            {
                name: "类型2",
                value: 250,
            },
            {
                name: "类型3",
                value: 200,
            },
            {
                name: "类型4",
                value: 150,
            },
        ],
    });

    const getNumber = (slotProps) => {
        return Number(((slotProps.data.value / slotProps.data.count) * 100).toFixed(2));
    };

    return (
        <div className="left-card">
            <MCard title="年度经济增长点" height={300}>
                <div className="pie-chat-wrap" style={{ height: '100%', display: 'flex' }}>
                    <div className="pie-chat" style={{ flex: 1, minHeight: '200px' }}>
                        <MPieFixed
                            ref={pieRef}
                            data={state.pieData}
                            delay={3000}
                            colors={state.pieDataColor}
                            opacity={0.6}
                            className="pieCanvas"
                        >
                            {(slotProps) => (
                                <div className="pieCanvas-content">
                                    <div className="pieCanvas-content-value">
                                        <MCountTo
                                            startVal={0}
                                            endVal={getNumber(slotProps)}
                                            decimals={2}
                                            duration={1000}
                                            autoplay={true}
                                        />
                                        %
                                    </div>
                                    <div className="pieCanvas-content-name">
                                        {slotProps.data.name}
                                    </div>
                                </div>
                            )}
                        </MPieFixed>
                    </div>

                    <div className="pie-legend">
                        {state.pieData.map((item, index) => (
                            <div className="pie-legend-item" key={index}>
                                <div
                                    className="icon"
                                    style={{ borderColor: state.pieDataColor[index] }}
                                ></div>
                                <div className="name">{item.name}</div>
                                <div className="value">
                                    {item.value}
                                    <span className="unit">亿</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </MCard>
        </div>
    );
};

export default YearlyEconomyTrend;