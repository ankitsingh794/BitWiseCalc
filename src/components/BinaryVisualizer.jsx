import React from "react";
import "../Styles/BinaryVisualizer.css";

const BinaryVisualizer = ({ num, label = "", showBits = true, compact = false }) => {
  if (num === undefined || num === null || num === "") {
    return null;
  }

  const binary = num.toString(2);
  const padded = binary.padStart(8, "0");

  if (compact) {
    return (
      <div className="binary-compact">
        <span className="binary-label">{label}:</span>
        <span className="binary-value">{binary}</span>
      </div>
    );
  }

  return (
    <div className="binary-visualizer">
      {label && <div className="binary-label">{label}</div>}
      <div className="bit-grid">
        {padded.split("").map((bit, idx) => (
          <div key={idx} className={`bit ${bit === "1" ? "bit-one" : "bit-zero"}`}>
            <span className="bit-value">{bit}</span>
            <span className="bit-index">{8 - idx - 1}</span>
          </div>
        ))}
      </div>
      <div className="binary-info">
        <div>Decimal: {num}</div>
        <div>Binary: {binary}</div>
      </div>
    </div>
  );
};

export const BinaryOperationVisualizer = ({ num1, num2, operation, result }) => {
  const bin1 = num1.toString(2);
  const bin2 = num2.toString(2);
  const maxLen = Math.max(bin1.length, bin2.length);
  
  const padded1 = bin1.padStart(maxLen, "0");
  const padded2 = bin2.padStart(maxLen, "0");
  const resultBin = result.toString(2).padStart(maxLen, "0");

  return (
    <div className="operation-visualizer">
      <div className="operation-rows">
        <div className="operation-row">
          <span className="row-label">A:</span>
          <div className="bit-sequence">
            {padded1.split("").map((bit, idx) => (
              <span key={idx} className={`bit-item ${bit === "1" ? "one" : "zero"}`}>
                {bit}
              </span>
            ))}
          </div>
        </div>

        <div className="operation-row">
          <span className="row-label">{operation}:</span>
          <div className="bit-sequence">
            {padded2.split("").map((bit, idx) => (
              <span key={idx} className={`bit-item ${bit === "1" ? "one" : "zero"}`}>
                {bit}
              </span>
            ))}
          </div>
        </div>

        <div className="operation-divider">─────────</div>

        <div className="operation-row result">
          <span className="row-label">Result:</span>
          <div className="bit-sequence">
            {resultBin.split("").map((bit, idx) => (
              <span key={idx} className={`bit-item ${bit === "1" ? "one" : "zero"}`}>
                {bit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryVisualizer;
