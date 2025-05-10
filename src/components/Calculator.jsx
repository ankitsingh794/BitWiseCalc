import React, { useState } from "react";
import {
  bitwiseAdd,
  bitwiseSubtract,
  isEven,
  countSetBits,
  modPowerOfTwo,
} from "../utils/bitOperations";
import "../styles/Calculator.css";

const Calculator = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState("");
  const [description, setDescription] = useState("");
  const [binaryDisplay, setBinaryDisplay] = useState("");

  const handleCalculate = () => {
    const a = parseInt(num1);
    const b = parseInt(num2);
    let res, desc;

    switch (operation) {
      case "add":
        res = bitwiseAdd(a, b);
        desc = `Calculates ${a} + ${b} using bit manipulation`;
        break;
      case "subtract":
        res = bitwiseSubtract(a, b);
        desc = `Calculates ${a} - ${b} using bit manipulation`;
        break;
      case "even":
        res = isEven(a) ? "Even" : "Odd";
        desc = `Checks if ${a} is Even or Odd using bitwise AND`;
        break;
      case "setBits":
        res = countSetBits(a);
        desc = `Counts number of 1s in binary of ${a}`;
        break;
      case "modPower":
        res = modPowerOfTwo(a, b);
        desc = `${a} % ${b} using bitwise AND (b must be power of 2)`;
        break;
      default:
        res = "Invalid Operation";
        desc = "";
    }

    setResult(res);
    const binA = a ? a.toString(2) : "0";
    const binB = b ? b.toString(2) : "0";
    setBinaryDisplay(`A: ${binA} | B: ${operation !== "even" && operation !== "setBits" ? binB : "—"}`);
    setDescription(desc);
  };

  return (
    <div className="calculator-container">
      <div className="input-row">
        <input
          type="number"
          placeholder="A"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
        />

        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">Addition</option>
          <option value="subtract">Subtraction</option>
          <option value="even">Even / Odd</option>
          <option value="setBits">Count Set Bits</option>
          <option value="modPower">Modulo (Power of 2)</option>
        </select>
      </div>

      {operation !== "even" && operation !== "setBits" && (
        <input
          type="number"
          placeholder="B"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
        />
      )}

      <button className="calculate-btn" onClick={handleCalculate}>
        Calculate
      </button>

      <div className="result-box">
        <p><strong>Result:</strong> {result}</p>
        <p>{description}</p>
      </div>

      <div className="binary-display">
        <h4>Binary Display</h4>
        <p>{binaryDisplay}</p>
      </div>
    </div>
  );
};

export default Calculator;
