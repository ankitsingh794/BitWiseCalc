import React from "react";
import "../styles/Calculator.css"; 

const TabSwitcher = ({ activeTab, onTabChange }) => {
  const tabs = ["Standard", "Bitwise Ops", "Checker"];

  return (
    <div className="tab-buttons">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
