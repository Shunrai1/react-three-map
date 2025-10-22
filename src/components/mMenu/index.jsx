import React, { createContext, useState, useEffect } from "react";
import "./index.scss";

export const MenuContext = createContext();

export default function MMenu(props) {
  const { children, defaultIndex, onSelect } = props;

  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const updateActive = (index) => {
    setActiveIndex(index);
    onSelect(index);
  };

  useEffect(() => {
    if (defaultIndex !== activeIndex) {
      setActiveIndex(defaultIndex);
    }
  }, [defaultIndex]);
  return <div className="m-menu">
    <MenuContext.Provider value={{ activeIndex, updateActive }}>
      {children}
    </MenuContext.Provider>
  </div>;
}
