import React, { useState, useEffect } from "react";
import "../Styles/AnimatedOperationVisualizer.css";

const AnimatedOperationVisualizer = ({ 
  num1, 
  num2, 
  operation, 
  result,
  animationSpeed = 300 
}) => {
  const [activePosition, setActivePosition] = useState(-1);
  const [completedPositions, setCompletedPositions] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(true);

  const bin1 = num1.toString(2);
  const bin2 = num2.toString(2);
  const maxLen = Math.max(bin1.length, bin2.length);
  
  const padded1 = bin1.padStart(maxLen, "0");
  const padded2 = bin2.padStart(maxLen, "0");
  const resultBin = result.toString(2).padStart(maxLen, "0");

  // Get operation display name
  const getOperationSymbol = (op) => {
    if (op === "and") return "AND";
    if (op === "or") return "OR";
    return op.toUpperCase();
  };

  // Run animation sequence
  useEffect(() => {
    if (!isAnimating) return;

    const sequence = async () => {
      setCompletedPositions(new Set());
      
      for (let i = 0; i < maxLen; i++) {
        setActivePosition(i);
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        
        setCompletedPositions(prev => new Set([...prev, i]));
      }
      
      setActivePosition(-1);
    };

    const timeout = setTimeout(sequence, 500);
    return () => clearTimeout(timeout);
  }, [isAnimating, maxLen, animationSpeed]);

  const renderBitRow = (bits, label, isInput = true) => {
    return (
      <div className="animated-bit-row">
        <span className="row-label">{label}</span>
        <div className="bit-sequence-animated">
          {bits.split("").map((bit, idx) => {
            const isActive = idx === activePosition;
            const isCompleted = completedPositions.has(idx);
            
            return (
              <div
                key={idx}
                className={`animated-bit ${bit === "1" ? "one" : "zero"} ${
                  isActive ? "active" : ""
                } ${isCompleted && !isActive ? "completed" : ""}`}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <span className="bit-content">{bit}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResultRow = () => {
    return (
      <div className="animated-bit-row result-row">
        <span className="row-label result-label">Result</span>
        <div className="bit-sequence-animated">
          {resultBin.split("").map((bit, idx) => {
            const isCompleted = completedPositions.has(idx);
            
            return (
              <div
                key={idx}
                className={`animated-bit result-bit ${bit === "1" ? "one" : "zero"} ${
                  isCompleted ? "show" : "hidden"
                }`}
              >
                <span className="bit-content">{bit}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animated-operation-container">
      <div className="operation-header">
        <h4>Animated {getOperationSymbol(operation)} Operation</h4>
        <button 
          className="animation-toggle-btn"
          onClick={() => setIsAnimating(!isAnimating)}
        >
          {isAnimating ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      <div className="animation-visualization">
        {renderBitRow(padded1, "A")}

        <div className="operation-symbol">
          <span className="symbol">{getOperationSymbol(operation)}</span>
        </div>

        {renderBitRow(padded2, "B")}

        <div className="animation-divider">
          <span className="divider-line">━━━━━━━━━━━━━━━━━━━</span>
        </div>

        {renderResultRow()}
      </div>

      <div className="animation-legend">
        <div className="legend-item">
          <div className="legend-bit one">1</div>
          <span>Set Bit</span>
        </div>
        <div className="legend-item">
          <div className="legend-bit zero">0</div>
          <span>Unset Bit</span>
        </div>
        <div className="legend-item">
          <div className="legend-bit active">→</div>
          <span>Currently Processing</span>
        </div>
      </div>

      <div className="step-info">
        <p>Processing bit position: <strong>{activePosition >= 0 ? activePosition : "Complete"}</strong></p>
      </div>
    </div>
  );
};

export default AnimatedOperationVisualizer;
