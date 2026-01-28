import React, { useState } from "react";
import {
  bitwiseAdd,
  bitwiseSubtract,
  isEven,
  countSetBits,
  modPowerOfTwo,
  isPowerOfTwo,
  bitwiseMultiply,
  bitwiseDivide,
  myPow,
  getPaddedBinary,
  bitwiseAND,
  bitwiseOR
} from "../utils/bitOperations";
import BinaryVisualizer, { BinaryOperationVisualizer } from "./BinaryVisualizer";
import AnimatedOperationVisualizer from "./AnimatedOperationVisualizer";
import ColumnByColumnVisualizer from "./ColumnByColumnVisualizer";
import ArithmeticBreakdownVisualizer from "./ArithmeticBreakdownVisualizer";
import UnaryOperationVisualizer from "./UnaryOperationVisualizer";
import "../Styles/Calculator.css";

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
      case "multiply":
        res = bitwiseMultiply(a, b);
        desc = `Calculates ${a} * ${b} using bit manipulation`;
        break;
      case "divide":
        res = bitwiseDivide(a, b);
        desc = `Calculates ${a} / ${b} using bit manipulation`;
        break;
      case "and":
        res = bitwiseAND(a, b);
        desc = `AND operation: Returns 1 only when both bits are 1`;
        break;
      case "or":
        res = bitwiseOR(a, b);
        desc = `OR operation: Returns 1 when at least one bit is 1`;
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
      case "isPower":
        res = isPowerOfTwo(a) ? "Yes" : "No";
        desc = `Checks if ${a} is a power of 2 or not`;
        break;
      case "power":
        res = myPow(a, b);
        desc = `Calculates ${a} raised to the power of ${b} (Aⁿ) using exponentiation by squaring`;
        break;
      default:
        res = "Invalid Operation";
        desc = "";
    }

    setResult(res);
    const binA = a ? a.toString(2) : "0";
    const binB = b ? b.toString(2) : "0";
    setBinaryDisplay(`A: ${binA} | B: ${operation !== "even" && operation !== "setBits" && operation !== "isPower" ? binB : "—"}`);
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
          <option value="multiply">Multiplication</option>
          <option value="divide">Division</option>
          <option value="and">Bitwise AND</option>
          <option value="or">Bitwise OR</option>
          <option value="even">is Even / Odd ?</option>
          <option value="setBits">Count Set Bits</option>
          <option value="modPower">Modulo (Power of 2)</option>
          <option value="isPower">Check if Power of 2</option>
          <option value="power">Power (Aⁿ)</option>
        </select>
      </div>

      {operation !== "even" && operation !== "setBits" && operation != "isPower" &&(
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

      {/* Arithmetic breakdown for addition, subtraction, multiply, divide */}
      {(operation === "add" || operation === "subtract" || operation === "multiply" || operation === "divide") && 
        num1 && num2 && result !== "" && (
        <ArithmeticBreakdownVisualizer
          num1={parseInt(num1) || 0}
          num2={parseInt(num2) || 0}
          operation={operation}
          result={typeof result === 'number' ? result : 0}
        />
      )}

      {/* Column-by-column visualization for AND and OR */}
      {(operation === "and" || operation === "or") && num1 && num2 && result !== "" && (
        <ColumnByColumnVisualizer
          num1={parseInt(num1) || 0}
          num2={parseInt(num2) || 0}
          operation={operation}
          result={typeof result === 'number' ? result : 0}
        />
      )}

      {/* Animated visualization for AND/OR (in addition to column view) */}
      {(operation === "and" || operation === "or") && num1 && num2 && result !== "" && (
        <AnimatedOperationVisualizer 
          num1={parseInt(num1) || 0} 
          num2={parseInt(num2) || 0} 
          operation={operation}
          result={typeof result === 'number' ? result : 0}
          animationSpeed={300}
        />
      )}

      {/* Visual representation of binary numbers for other operations */}
      {(operation === "add" || operation === "subtract" || operation === "multiply" || operation === "divide") && num1 && (
        <div className="binary-visualization">
          <h4>Binary Visualization</h4>
          <BinaryOperationVisualizer 
            num1={parseInt(num1) || 0} 
            num2={parseInt(num2) || 0} 
            operation={operation}
            result={result !== "" ? (typeof result === 'number' ? result : 0) : 0}
          />
        </div>
      )}

      {/* Unary operation breakdown for even/odd, setBits, isPower, modPower */}
      {(operation === "even" || operation === "setBits" || operation === "isPower" || operation === "modPower") && 
        num1 && result !== "" && (
        <UnaryOperationVisualizer
          num={parseInt(num1) || 0}
          operation={operation}
          result={result}
        />
      )}

      {/* Individual bit visualization for single operations */}
      {(operation === "even" || operation === "setBits" || operation === "isPower") && num1 && (
        <div className="binary-visualization">
          <h4>Binary Representation</h4>
          <BinaryVisualizer 
            num={parseInt(num1) || 0} 
            label={`Number A`}
            showBits={true}
          />
        </div>
      )}

      {/* Modulo visualization */}
      {operation === "modPower" && num1 && num2 && (
        <div className="binary-visualization">
          <h4>Binary Visualization</h4>
          <BinaryOperationVisualizer 
            num1={parseInt(num1) || 0} 
            num2={parseInt(num2) || 0} 
            operation="mod"
            result={result !== "" && result !== "Error: B is not a power of 2" ? parseInt(result) : 0}
          />
        </div>
      )}

      <div className="binary-display">
        <h4>Binary Details</h4>
        <p>{binaryDisplay}</p>
      </div>
    </div>
  );
};

export default Calculator;
