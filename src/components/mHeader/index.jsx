import React from 'react';
import './index.scss';
import SvgLineAnimation from '../mSvglineAnimation';
const MHeader = (props) => {
    const { title = '数据可视化大屏', subText = 'Visualization Platform', leftSlot, rightSlot } = props;
    return (
        <div className="m-header">
            <div className="m-header-wrap">
                <div className="m-header-title">{title}</div>
                <div className="m-header-subtext">{subText}</div>
            </div>
            <div className="m-header-left" style={{ color: '#fff' }}>
                {leftSlot}
            </div>
            <div className="m-header-right" >
                {rightSlot}
            </div>
            <div className="m-header-line">
                <SvgLineAnimation
                    className="m-header-line-left"
                    width={961}
                    height={79}
                    color="#30DCFF"
                    strokeWidth={2}
                    dir={[0, 1]}
                    length={100}
                    path="M1 1.52783L535 25.6808C552.73 26.5835 571.454 31.3851 588.834 39.2194C593.758 41.4385 598.692 43.7289 603.643 46.0273C633.567 59.9182 664.121 74.1016 696.754 74.6262C696.765 74.6264 696.775 74.6265 696.786 74.6267C821.602 76.5993 879.336 78 961 78"
                ></SvgLineAnimation>
                <SvgLineAnimation
                    className="m-header-line-right"
                    width={961}
                    height={79}
                    color="#30DCFF"
                    strokeWidth={2}
                    dir={[0, 1]}
                    length={100}
                    path="M1 1.52783L535 25.6808C552.73 26.5835 571.454 31.3851 588.834 39.2194C593.758 41.4385 598.692 43.7289 603.643 46.0273C633.567 59.9182 664.121 74.1016 696.754 74.6262C696.765 74.6264 696.775 74.6265 696.786 74.6267C821.602 76.5993 879.336 78 961 78"
                ></SvgLineAnimation>
            </div>
        </div >
    );
};

export default MHeader;