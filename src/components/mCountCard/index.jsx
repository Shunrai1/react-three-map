import React from 'react'
import './index.scss';
import MCountTo from '@/components/mCountTo';

export default function MCountCard({ info = {
    icon: "xiaoshoujine",
    zh: "2023年销售金额",
    en: "Sales amount in 2023",
    value: 9500,
    unit: "万元",
    decimals: 0,
} }) {

    const toUpper = (str) => {
        return str.toUpperCase();
    }
    return (
        <div className='count-card'>

            <div className="count-card-left">
                <div className={"count-card-icon icon-" + info.icon}></div>
                <div className="count-card-title">
                    <div className="title-zh">{info.zh}</div>
                    <div className="title-en">{toUpper(info.en)}</div>
                </div>
            </div>

            <div className="count-card-right">
                <div className="value">
                    <MCountTo
                        startVal={0}
                        endVal={info.value}
                        decimals={info.decimals}
                        duration={2000}
                        separator=""
                        autoplay={true}
                    />
                </div>
                <div className="unit">{info.unit}</div>
            </div>
        </div >

    )
}
