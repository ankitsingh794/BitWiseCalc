// src/App.jsx
import React, { useState } from "react";
import TabSwitcher from "./components/TabSwitcher";
import StandardPage from "./pages/StandardPage";
import BitwiseOpsPage from "./pages/BitwiseOpsPage";
import CheckerPage from "./pages/CheckerPage";

const App = () => {
  const [activeTab, setActiveTab] = useState("Standard");

  const renderPage = () => {
    switch (activeTab) {
      case "Standard":
        return <StandardPage />;
      case "Bitwise Ops":
        return <BitwiseOpsPage />;
      case "Checker":
        return <CheckerPage />;
      default:
        return <StandardPage />;
    }
  };

  return (
    <div className="app-container">
      <h1>BitWiseCalc</h1>
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      {renderPage()}
    </div>
  );
};

export default App;
