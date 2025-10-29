import React from 'react'
import './index.scss';
import radarBg from '@/assets/images/radar/radar-bg.png';
import saomiao from '@/assets/images/radar/saomiao.png';

export default function MRadar() {
    return (
        <div className="m-radar">
            <img className="m-radar-bg" src={radarBg} alt="" />
            <img className="m-radar-saomiao" src={saomiao} alt="" />
        </div>
    )
}
