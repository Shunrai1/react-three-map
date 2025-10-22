import React, { useContext } from 'react'
import { MenuContext } from '../mMenu'

export default function MMenuItem(props) {
    const { index, children } = props;
    const { activeIndex, updateActive } = useContext(MenuContext);

    const handleClick = () => {
        updateActive(index);
    };
    return (
        <div className={`m-menu-item ${activeIndex === index ? 'is-active' : ''}`} onClick={handleClick}>
            {children}
        </div>
    )
}
