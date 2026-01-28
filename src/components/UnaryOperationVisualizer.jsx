import React, { useState, useEffect } from "react";
import "../Styles/UnaryOperationVisualizer.css";

const UnaryOperationVisualizer = ({ num, operation, result }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const binary = num.toString(2).padStart(8, "0");

  const getEvenOddBreakdown = () => {
    const lsb = num & 1; // Extract least significant bit
    return [
      {
        step: 1,
        title: "Extract Least Significant Bit (LSB)",
        description: "Use bitwise AND with 1 to check the last bit",
        operation: `${num} & 1`,
        binaryOp: `${binary} & 00000001`,
        details: `LSB = ${lsb}`,
        result: lsb === 0 ? "Even (LSB = 0)" : "Odd (LSB = 1)",
      },
    ];
  };

  const getCountBitsBreakdown = () => {
    const steps = [];
    let n = num;
    let count = 0;
    let stepNum = 1;

    steps.push({
      step: stepNum++,
      title: "Initialize",
      description: "Start with count = 0 and n = " + num,
      operation: `n = ${num.toString(2).padStart(8, "0")}`,
      details: `Initial count: 0`,
      bitState: num.toString(2).padStart(8, "0"),
    });

    while (n > 0) {
      const currentBinary = n.toString(2).padStart(8, "0");
      const nMinus1 = n - 1;
      const nMinus1Binary = nMinus1.toString(2).padStart(8, "0");
      const result = n & nMinus1;
      const resultBinary = result.toString(2).padStart(8, "0");

      steps.push({
        step: stepNum++,
        title: `Step ${stepNum - 2}: Count Set Bit`,
        description: `Use n = n & (n-1) to clear the rightmost set bit`,
        operation: `n & (n-1)`,
        details: `${currentBinary} & ${nMinus1Binary} = ${resultBinary}`,
        intermediate: `n = ${result}, count = ${count + 1}`,
        bitState: resultBinary,
        highlighted: count,
      });

      n = result;
      count++;
    }

    steps.push({
      step: stepNum,
      title: "Complete",
      description: "All set bits have been counted",
      result: `Total set bits: ${count}`,
      finalResult: true,
    });

    return steps;
  };

  const getPowerOfTwoBreakdown = () => {
    const isValid = num > 0 && (num & (num - 1)) === 0;
    const nMinus1 = num - 1;

    return [
      {
        step: 1,
        title: "Check if number > 0",
        description: `${num} > 0? ${num > 0 ? "Yes" : "No"}`,
        result: !num > 0 ? "Not a power of 2 (negative/zero)" : "Continue checking",
      },
      {
        step: 2,
        title: "Check if (n & (n-1)) == 0",
        description: "A power of 2 has only one set bit",
        operation: `${num} & ${nMinus1}`,
        binaryOp: `${num.toString(2).padStart(8, "0")} & ${nMinus1.toString(2).padStart(8, "0")}`,
        details: `Result = ${num & (num - 1)}`,
        result: isValid ? `Yes, ${num} is a power of 2` : `No, ${num} is not a power of 2`,
      },
    ];
  };

  const getModBreakdown = () => {
    const divisor = num;
    const bitLength = Math.log2(divisor);
    const isPowerOfTwo = divisor > 0 && (divisor & (divisor - 1)) === 0;

    return [
      {
        step: 1,
        title: "Check if divisor is power of 2",
        description: `For modulo by powers of 2, use bitwise AND`,
        operation: `${divisor} & (${divisor} - 1)`,
        binaryOp: `${divisor.toString(2).padStart(8, "0")} & ${(divisor - 1).toString(2).padStart(8, "0")}`,
        details: `Result = ${divisor & (divisor - 1)}`,
        result: isPowerOfTwo ? "Yes, can use bitwise AND" : "Not a power of 2",
      },
      ...(isPowerOfTwo
        ? [
            {
              step: 2,
              title: "Mask with (divisor - 1)",
              description: `Use AND with ${divisor - 1} to get remainder`,
              operation: `n & (${divisor} - 1)`,
              binaryOp: `n & ${(divisor - 1).toString(2).padStart(8, "0")}`,
              details: `This masks the lower ${bitLength} bits`,
              explanation: `The lower ${Math.log2(divisor)} bits represent values 0 to ${divisor - 1}`,
            },
          ]
        : []),
    ];
  };

  const getBreakdown = () => {
    switch (operation) {
      case "even":
        return getEvenOddBreakdown();
      case "setBits":
        return getCountBitsBreakdown();
      case "isPower":
        return getPowerOfTwoBreakdown();
      case "modPower":
        return getModBreakdown();
      default:
        return [];
    }
  };

  const steps = getBreakdown();

  useEffect(() => {
    if (!isAnimating || activeStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => new Set([...prev, activeStep]));
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        setIsAnimating(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnimating, activeStep, steps.length]);

  const toggleAnimation = () => {
    if (!isAnimating && activeStep >= steps.length - 1) {
      setActiveStep(0);
      setCompletedSteps(new Set());
    }
    setIsAnimating(!isAnimating);
  };

  const resetAnimation = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setIsAnimating(false);
  };

  const currentStep = steps[activeStep];

  return (
    <div className="unary-operation-visualizer">
      <div className="visualizer-header">
        <h3>
          {operation === "even" && "Even/Odd Check"}
          {operation === "setBits" && "Count Set Bits"}
          {operation === "isPower" && "Power of Two Check"}
          {operation === "modPower" && "Modulo (Power of 2)"}
        </h3>
        <p className="visualizer-desc">
          {operation === "even" && "Uses bitwise AND to check if the number is even or odd"}
          {operation === "setBits" && "Uses Brian Kernighan's algorithm to count set bits"}
          {operation === "isPower" && "Uses bitwise AND to verify if number is a power of 2"}
          {operation === "modPower" && "Uses bitwise AND to compute modulo for powers of 2"}
        </p>
      </div>

      <div className="input-display">
        <div className="number-info">
          <span className="label">Input:</span>
          <span className="value">{num}</span>
          <span className="binary">{binary}</span>
        </div>
        <div className="result-info">
          <span className="label">Result:</span>
          <span className="value">{result}</span>
        </div>
      </div>

      <div className="controls">
        <button onClick={toggleAnimation} className="control-btn">
          {isAnimating ? "⏸ Pause" : "▶ Play"}
        </button>
        <button onClick={resetAnimation} className="control-btn">
          ⟲ Reset
        </button>
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="control-btn"
        >
          {showSteps ? "▼ Hide Details" : "▶ Show Details"}
        </button>
      </div>

      {showSteps && (
        <div className="steps-container">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-item ${
                index === activeStep ? "active" : ""
              } ${completedSteps.has(index) ? "completed" : ""}`}
            >
              <div className="step-number">Step {step.step}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p className="step-description">{step.description}</p>

                {step.operation && (
                  <div className="operation-box">
                    <strong>Operation:</strong>
                    <code>{step.operation}</code>
                  </div>
                )}

                {step.binaryOp && (
                  <div className="binary-operation">
                    <strong>Binary:</strong>
                    <code>{step.binaryOp}</code>
                  </div>
                )}

                {step.details && (
                  <div className="details-box">
                    <strong>Details:</strong>
                    <code>{step.details}</code>
                  </div>
                )}

                {step.intermediate && (
                  <div className="intermediate-result">
                    <strong>After this step:</strong>
                    <code>{step.intermediate}</code>
                  </div>
                )}

                {step.explanation && (
                  <div className="explanation-box">
                    <strong>Why:</strong>
                    <p>{step.explanation}</p>
                  </div>
                )}

                {step.result && (
                  <div className="step-result">
                    <strong>Result:</strong>
                    <code>{step.result}</code>
                  </div>
                )}

                {step.finalResult && (
                  <div className="final-result">
                    <strong>✓ Final Result:</strong>
                    <code>{step.result}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        ></div>
        <span className="progress-text">
          Step {activeStep + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
};

export default UnaryOperationVisualizer;
