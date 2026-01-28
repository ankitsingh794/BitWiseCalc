import React, { useState, useEffect } from "react";
import "../Styles/ColumnByColumnVisualizer.css";

const ColumnByColumnVisualizer = ({ num1, num2, operation, result }) => {
  const [activeColumn, setActiveColumn] = useState(-1);
  const [completedColumns, setCompletedColumns] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(true);

  const bin1 = num1.toString(2);
  const bin2 = num2.toString(2);
  const maxLen = Math.max(bin1.length, bin2.length);

  const padded1 = bin1.padStart(maxLen, "0");
  const padded2 = bin2.padStart(maxLen, "0");
  const resultBin = result.toString(2).padStart(maxLen, "0");

  // Get truth table result
  const getTruthResult = (bit1, bit2) => {
    const b1 = parseInt(bit1);
    const b2 = parseInt(bit2);

    if (operation === "and") return (b1 & b2).toString();
    if (operation === "or") return (b1 | b2).toString();
    if (operation === "xor") return (b1 ^ b2).toString();
    return "0";
  };

  // Get operation symbol
  const getOperationSymbol = (op) => {
    if (op === "and") return "&";
    if (op === "or") return "|";
    if (op === "xor") return "⊕";
    return op;
  };

  // Get operation name and description
  const getOperationInfo = (op) => {
    const info = {
      and: {
        name: "Bitwise AND",
        description: "Both must be 1 for result to be 1",
        rule: "Result = 1 only if A AND B are both 1",
      },
      or: {
        name: "Bitwise OR",
        description: "At least one must be 1 for result to be 1",
        rule: "Result = 1 if A OR B (or both) are 1",
      },
      xor: {
        name: "Bitwise XOR",
        description: "Bits must be different for result to be 1",
        rule: "Result = 1 if A XOR B are different",
      },
    };
    return info[op] || {};
  };

  // Animation logic
  useEffect(() => {
    if (!isAnimating) return;

    const sequence = async () => {
      setCompletedColumns(new Set());

      for (let i = 0; i < maxLen; i++) {
        setActiveColumn(i);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setCompletedColumns((prev) => new Set([...prev, i]));
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setActiveColumn(-1);
    };

    const timeout = setTimeout(sequence, 500);
    return () => clearTimeout(timeout);
  }, [isAnimating, maxLen]);

  const opInfo = getOperationInfo(operation);
  const opSymbol = getOperationSymbol(operation);

  return (
    <div className="column-visualizer-container">
      <div className="viz-header">
        <div className="op-info">
          <h3>{opInfo.name}</h3>
          <p className="op-rule">{opInfo.rule}</p>
        </div>
        <button
          className="animation-btn"
          onClick={() => setIsAnimating(!isAnimating)}
        >
          {isAnimating ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      <div className="columns-grid">
        {/* Header showing bit positions */}
        <div className="column-header">
          <div className="header-label"></div>
          {padded1.split("").map((_, idx) => (
            <div key={`header-${idx}`} className="column-position">
              <span>{maxLen - 1 - idx}</span>
            </div>
          ))}
        </div>

        {/* Row A */}
        <div className="bit-row row-a">
          <span className="row-name">A</span>
          {padded1.split("").map((bit, idx) => (
            <div
              key={`a-${idx}`}
              className={`column-bit ${bit === "1" ? "one" : "zero"} ${
                idx === activeColumn ? "active" : ""
              } ${completedColumns.has(idx) ? "completed" : ""}`}
            >
              {bit}
            </div>
          ))}
        </div>

        {/* Row B */}
        <div className="bit-row row-b">
          <span className="row-name">B</span>
          {padded2.split("").map((bit, idx) => (
            <div
              key={`b-${idx}`}
              className={`column-bit ${bit === "1" ? "one" : "zero"} ${
                idx === activeColumn ? "active" : ""
              } ${completedColumns.has(idx) ? "completed" : ""}`}
            >
              {bit}
            </div>
          ))}
        </div>

        {/* Column-by-column truth table display */}
        <div className="truth-row">
          <span className="row-name">Truth</span>
          {padded1.split("").map((bitA, idx) => {
            const bitB = padded2[idx];
            const resultBit = getTruthResult(bitA, bitB);
            const isActive = idx === activeColumn;
            const isCompleted = completedColumns.has(idx);

            return (
              <div
                key={`truth-${idx}`}
                className={`truth-box ${isActive ? "active" : ""} ${
                  isCompleted ? "show" : "hidden"
                }`}
              >
                <div className="truth-expression">
                  {bitA} {opSymbol} {bitB}
                </div>
                <div className="truth-arrow">→</div>
                <div className={`truth-result ${resultBit === "1" ? "one" : "zero"}`}>
                  {resultBit}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="divider-row">
          <span className="row-name"></span>
          {padded1.split("").map((_, idx) => (
            <div key={`div-${idx}`} className="divider-cell">
              ─
            </div>
          ))}
        </div>

        {/* Result row */}
        <div className="bit-row row-result">
          <span className="row-name">Result</span>
          {resultBin.split("").map((bit, idx) => (
            <div
              key={`result-${idx}`}
              className={`column-bit ${bit === "1" ? "one" : "zero"} ${
                completedColumns.has(idx) ? "reveal" : "hidden"
              }`}
            >
              {bit}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="column-legend">
        <div className="legend-row">
          <span className="legend-label">Decimal Values:</span>
          <span className="legend-value">
            A = {num1} | B = {num2} | Result = {result}
          </span>
        </div>
        <div className="legend-row">
          <span className="legend-label">Operation:</span>
          <span className="legend-value">{opInfo.description}</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="step-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                maxLen > 0
                  ? ((completedColumns.size + (activeColumn >= 0 ? 1 : 0)) /
                      maxLen) *
                    100
                  : 0
              }%`,
            }}
          ></div>
        </div>
        <span className="progress-text">
          {completedColumns.size} of {maxLen} bits processed
          {activeColumn >= 0 && ` (Processing bit ${activeColumn})`}
        </span>
      </div>
    </div>
  );
};

export default ColumnByColumnVisualizer;
