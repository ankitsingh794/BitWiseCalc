// src/App.jsx
import React, { useState } from "react";
import StandardPage from "./pages/StandardPage";
import "./App.css";


const App = () => {
  return (
    <div className="app-container">
      <h1 className="Heading">BitWiseCalc</h1>
      <StandardPage />
    </div>
  );
};

export default App;
