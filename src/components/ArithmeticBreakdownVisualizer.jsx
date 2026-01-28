import React, { useState, useEffect } from "react";
import "../Styles/ArithmeticBreakdownVisualizer.css";

const ArithmeticBreakdownVisualizer = ({ num1, num2, operation, result }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  const getOperationBreakdown = () => {
    if (operation === "add") return getAdditionBreakdown();
    if (operation === "subtract") return getSubtractionBreakdown();
    if (operation === "multiply") return getMultiplicationBreakdown();
    if (operation === "divide") return getDivisionBreakdown();
    return getAdditionBreakdown();
  };

  const getAdditionBreakdown = () => {
    const bin1 = num1.toString(2);
    const bin2 = num2.toString(2);
    const maxLen = Math.max(bin1.length, bin2.length) + 1;
    const padded1 = bin1.padStart(maxLen, "0");
    const padded2 = bin2.padStart(maxLen, "0");

    const steps = [];
    let carry = 0;

    for (let i = maxLen - 1; i >= 0; i--) {
      const bitA = parseInt(padded1[i]);
      const bitB = parseInt(padded2[i]);
      const xorResult = bitA ^ bitB;
      const andResult = bitA & bitB;
      const sum = xorResult ^ carry;
      const newCarry = (xorResult & carry) | andResult;

      steps.push({
        position: maxLen - 1 - i,
        bitA,
        bitB,
        xor: xorResult,
        and: andResult,
        carry,
        sum,
        newCarry,
      });
      carry = newCarry;
    }

    return { steps: steps.reverse(), padded1, padded2, type: "addition" };
  };

  const getSubtractionBreakdown = () => {
    const bin1 = num1.toString(2);
    const bin2 = num2.toString(2);
    const maxLen = Math.max(bin1.length, bin2.length) + 1;
    const padded1 = bin1.padStart(maxLen, "0");
    const padded2 = bin2.padStart(maxLen, "0");

    const steps = [];
    let borrow = 0;

    for (let i = maxLen - 1; i >= 0; i--) {
      const bitA = parseInt(padded1[i]);
      const bitB = parseInt(padded2[i]);
      const diff = bitA - borrow;
      const needsBorrow = diff < bitB;
      const resultBit = needsBorrow ? (diff + 2) - bitB : diff - bitB;
      const newBorrow = needsBorrow ? 1 : 0;

      steps.push({
        position: maxLen - 1 - i,
        bitA,
        bitB,
        borrow,
        diff,
        needsBorrow,
        result: resultBit,
        newBorrow,
      });
      borrow = newBorrow;
    }

    return { steps: steps.reverse(), padded1, padded2, type: "subtraction" };
  };

  const getMultiplicationBreakdown = () => {
    const multiplierBin = num2.toString(2);
    const steps = [];
    let partialProducts = [];
    let totalSum = 0;

    // Process each bit of multiplier from right to left
    for (let i = multiplierBin.length - 1; i >= 0; i--) {
      const bit = parseInt(multiplierBin[i]);
      const position = multiplierBin.length - 1 - i;
      const partial = bit === 1 ? num1 : 0;
      const shiftAmount = position;
      const shifted = partial << shiftAmount;

      if (bit === 1) {
        partialProducts.push(shifted);
        totalSum += shifted;
      }

      steps.push({
        bitPosition: i,
        bitIndex: multiplierBin.length - 1 - i,
        multiplierBit: bit,
        multiplicand: num1,
        partialProduct: partial,
        shiftAmount: shiftAmount,
        shifted: shifted,
        binary: shifted.toString(2).padStart(8, "0"),
        partial: partial,
        showInSum: bit === 1,
      });
    }

    return {
      steps: steps.reverse(),
      partialProducts,
      totalSum,
      padded1: num1.toString(2).padStart(8, "0"),
      padded2: num2.toString(2).padStart(8, "0"),
      type: "multiplication",
    };
  };

  const getDivisionBreakdown = () => {
    const dividendBin = num1.toString(2);
    const divisor = num2;
    const steps = [];
    let quotient = 0;
    let remainder = 0;

    // Process each bit of dividend from left to right
    for (let i = 0; i < dividendBin.length; i++) {
      const bit = parseInt(dividendBin[i]);
      
      // Bring down next bit
      remainder = (remainder << 1) | bit;
      
      // Check if remainder >= divisor
      let quotientBit = 0;
      let newRemainder = remainder;
      
      if (remainder >= divisor) {
        quotientBit = 1;
        newRemainder = remainder - divisor;
      }

      quotient = (quotient << 1) | quotientBit;

      steps.push({
        step: i + 1,
        bitIndex: i,
        bit: bit,
        dividendBit: bit,
        beforeRemainder: remainder >> 1,
        newRemainder: remainder,
        divisor: divisor,
        canDivide: remainder >= divisor,
        quotientBit: quotientBit,
        actualRemainder: newRemainder,
        partialQuotient: quotient,
        dividendBinary: dividendBin.padStart(8, "0"),
      });

      remainder = newRemainder;
    }

    return {
      steps,
      padded1: dividendBin.padStart(8, "0"),
      padded2: divisor.toString(2).padStart(8, "0"),
      finalQuotient: quotient,
      finalRemainder: remainder,
      type: "division",
    };
  };

  const breakdown = getOperationBreakdown();
  const { steps, padded1, padded2, type } = breakdown;

  useEffect(() => {
    if (!isAnimating) return;

    const sequence = async () => {
      setCompletedSteps(new Set());

      for (let i = 0; i < steps.length; i++) {
        setActiveStep(i);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCompletedSteps((prev) => new Set([...prev, i]));
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setActiveStep(-1);
    };

    const timeout = setTimeout(sequence, 500);
    return () => clearTimeout(timeout);
  }, [isAnimating, steps.length]);

  const getTitle = () => {
    const titles = {
      addition: "Addition Breakdown",
      subtraction: "Subtraction Breakdown",
      multiplication: "Multiplication Breakdown (Shift-and-Add)",
      division: "Division Breakdown (Long Division)",
    };
    return titles[type] || "Operation Breakdown";
  };

  const getDescription = () => {
    const descriptions = {
      addition: "XOR finds sum bits | AND finds carry | Carry propagates left",
      subtraction: "Calculate difference | Check for borrow | Borrow propagates left",
      multiplication: "For each multiplier bit: shift and add partial products",
      division: "Bit-by-bit: check if remainder ≥ divisor, set quotient bit",
    };
    return descriptions[type] || "Operation breakdown";
  };

  return (
    <div className="arithmetic-breakdown-container">
      <div className="breakdown-header">
        <div className="breakdown-title">
          <h3>{getTitle()}</h3>
          <p>{getDescription()}</p>
        </div>
        <div className="breakdown-controls">
          <button
            className="animation-btn"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            className="steps-toggle"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? "Hide" : "Show"} Steps
          </button>
        </div>
      </div>

      {/* Addition/Subtraction Grid */}
      {(type === "addition" || type === "subtraction") && (
        <div className="arithmetic-grid">
          <div className="grid-header">
            <div className="header-label">Bit:</div>
            {padded1.split("").map((_, idx) => (
              <div key={`h-${idx}`} className="grid-cell header-cell">
                {padded1.length - 1 - idx}
              </div>
            ))}
          </div>

          <div className="grid-row">
            <div className="row-label">A</div>
            {padded1.split("").map((bit, idx) => (
              <div
                key={`a-${idx}`}
                className={`grid-cell bit-cell ${bit === "1" ? "one" : "zero"} ${
                  idx === activeStep ? "active" : ""
                }`}
              >
                {bit}
              </div>
            ))}
          </div>

          <div className="grid-row">
            <div className="row-label">B</div>
            {padded2.split("").map((bit, idx) => (
              <div
                key={`b-${idx}`}
                className={`grid-cell bit-cell ${bit === "1" ? "one" : "zero"} ${
                  idx === activeStep ? "active" : ""
                }`}
              >
                {bit}
              </div>
            ))}
          </div>

          <div className="grid-row carry-row">
            <div className="row-label">{type === "addition" ? "C-In" : "B-In"}</div>
            {padded1.split("").map((_, idx) => {
              const carryIn =
                idx > 0
                  ? type === "addition"
                    ? steps[idx - 1]?.newCarry || 0
                    : steps[idx - 1]?.newBorrow || 0
                  : 0;
              return (
                <div
                  key={`cin-${idx}`}
                  className={`grid-cell carry-cell ${
                    carryIn === 1 ? "carry-set" : ""
                  } ${idx === activeStep ? "active" : ""}`}
                >
                  {carryIn}
                </div>
              );
            })}
          </div>

          <div className="step-divider"></div>

          {type === "addition" && (
            <>
              <div className="grid-row operation-row">
                <div className="row-label operation-label">
                  <span className="op-symbol">⊕</span> XOR
                </div>
                {padded1.split("").map((_, idx) => (
                  <div
                    key={`xor-${idx}`}
                    className={`grid-cell operation-cell xor-cell ${
                      steps[idx]?.xor === 1 ? "active-op" : ""
                    } ${idx === activeStep ? "highlight" : ""}`}
                  >
                    {steps[idx]?.xor || 0}
                  </div>
                ))}
              </div>

              <div className="grid-row operation-row">
                <div className="row-label operation-label">
                  <span className="op-symbol">&</span> AND
                </div>
                {padded1.split("").map((_, idx) => (
                  <div
                    key={`and-${idx}`}
                    className={`grid-cell operation-cell and-cell ${
                      steps[idx]?.and === 1 ? "active-op" : ""
                    } ${idx === activeStep ? "highlight" : ""}`}
                  >
                    {steps[idx]?.and || 0}
                  </div>
                ))}
              </div>
            </>
          )}

          {type === "subtraction" && (
            <>
              <div className="grid-row operation-row">
                <div className="row-label operation-label">
                  <span className="op-symbol">−</span> Diff
                </div>
                {padded1.split("").map((_, idx) => (
                  <div
                    key={`diff-${idx}`}
                    className={`grid-cell operation-cell xor-cell ${
                      idx === activeStep ? "highlight" : ""
                    }`}
                  >
                    {steps[idx]?.diff || 0}
                  </div>
                ))}
              </div>

              <div className="grid-row operation-row">
                <div className="row-label operation-label">
                  <span className="op-symbol">⬇</span> Borrow?
                </div>
                {padded1.split("").map((_, idx) => (
                  <div
                    key={`bor-${idx}`}
                    className={`grid-cell operation-cell and-cell ${
                      steps[idx]?.needsBorrow ? "active-op" : ""
                    } ${idx === activeStep ? "highlight" : ""}`}
                  >
                    {steps[idx]?.needsBorrow ? "✓" : "−"}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="grid-row">
            <div className="row-label carry-label">{type === "addition" ? "C-Out" : "B-Out"}</div>
            {padded1.split("").map((_, idx) => {
              const carryOut =
                type === "addition"
                  ? steps[idx]?.newCarry || 0
                  : steps[idx]?.newBorrow || 0;
              return (
                <div
                  key={`cout-${idx}`}
                  className={`grid-cell carry-cell ${
                    carryOut === 1 ? "carry-set" : ""
                  } ${idx === activeStep ? "active" : ""}`}
                >
                  {carryOut}
                </div>
              );
            })}
          </div>

          <div className="step-divider"></div>

          <div className="grid-row result-row">
            <div className="row-label">Result</div>
            {padded1.split("").map((_, idx) => {
              const res = type === "addition" ? steps[idx]?.sum : steps[idx]?.result;
              const isCompleted = completedSteps.has(idx);
              return (
                <div
                  key={`res-${idx}`}
                  className={`grid-cell result-cell ${
                    res === 1 ? "one" : "zero"
                  } ${isCompleted ? "reveal" : "hidden"}`}
                >
                  {res || 0}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Multiplication */}
      {type === "multiplication" && (
        <div className="multiplication-breakdown">
          <div className="mult-header">
            <h4>Shift-and-Add Multiplication</h4>
            <p className="mult-formula">{num1} × {num2} = {result}</p>
          </div>

          <div className="mult-equation">
            <div className="mult-equation-row">
              <span className="label">Multiplicand (A):</span>
              <span className="binary">{padded1}</span>
              <span className="decimal">({num1})</span>
            </div>
            <div className="mult-equation-row">
              <span className="label">Multiplier (B):</span>
              <span className="binary">{padded2}</span>
              <span className="decimal">({num2})</span>
            </div>
          </div>

          <div className="mult-steps-container">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`mult-step-card ${idx === activeStep ? "active" : ""} ${
                  completedSteps.has(idx) ? "completed" : ""
                }`}
              >
                <div className="step-header">
                  <span className="step-number">Step {step.bitIndex + 1}</span>
                  <span className="step-label">Bit Position {step.bitIndex}</span>
                </div>

                <div className="step-content">
                  <div className="step-row">
                    <span className="step-label-sm">Multiplier Bit:</span>
                    <span className="bit-value">{step.multiplierBit}</span>
                  </div>

                  {step.multiplierBit === 1 ? (
                    <>
                      <div className="step-row">
                        <span className="step-label-sm">Multiplicand:</span>
                        <span className="value">{num1}</span>
                      </div>
                      <div className="step-row">
                        <span className="step-label-sm">Shift Left by {step.shiftAmount}:</span>
                        <span className="value result-value">{step.shifted}</span>
                      </div>
                      <div className="step-row binary-row">
                        <span className="step-label-sm">Binary:</span>
                        <code className="binary-code">{step.binary}</code>
                      </div>
                    </>
                  ) : (
                    <div className="step-row neutral">
                      <span className="step-label-sm">Bit is 0 → Skip (add 0)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mult-final-sum">
            <h4>Partial Products Sum</h4>
            <div className="sum-calculation">
              <div className="products-list">
                {steps.filter(s => s.multiplierBit === 1).map((s, idx) => (
                  <div key={idx} className="product-item">
                    <span>{s.shifted}</span>
                    {idx < steps.filter(s => s.multiplierBit === 1).length - 1 && <span className="plus">+</span>}
                  </div>
                ))}
              </div>
              <div className="equals-line"></div>
              <div className="sum-result">{result}</div>
            </div>
          </div>
        </div>
      )}

      {/* Division */}
      {type === "division" && (
        <div className="division-breakdown">
          <div className="div-header">
            <h4>Long Division (Binary)</h4>
            <p className="div-formula">{num1} ÷ {num2} = {result} (remainder: {breakdown.finalRemainder || 0})</p>
          </div>

          <div className="div-equation">
            <div className="div-equation-row">
              <span className="label">Dividend:</span>
              <span className="binary">{padded1}</span>
              <span className="decimal">({num1})</span>
            </div>
            <div className="div-equation-row">
              <span className="label">Divisor:</span>
              <span className="binary">{padded2}</span>
              <span className="decimal">({num2})</span>
            </div>
          </div>

          <div className="div-process">
            <div className="div-steps-container">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`div-step-card ${idx === activeStep ? "active" : ""} ${
                    completedSteps.has(idx) ? "completed" : ""
                  }`}
                >
                  <div className="step-header">
                    <span className="step-number">Step {step.step}</span>
                    <span className="step-label">Processing bit {step.step}</span>
                  </div>

                  <div className="step-content">
                    <div className="step-row">
                      <span className="step-label-sm">Bit from Dividend:</span>
                      <span className="bit-value">{step.bit}</span>
                    </div>

                    <div className="step-row">
                      <span className="step-label-sm">Bring Down Bit:</span>
                      <div className="remainder-calc">
                        <span className="calc-part">({step.beforeRemainder} × 2) + {step.bit}</span>
                        <span className="calc-equals">=</span>
                        <span className="calc-result">{step.newRemainder}</span>
                      </div>
                    </div>

                    <div className="step-row check-row">
                      <span className="step-label-sm">Check:</span>
                      <div className="check-comparison">
                        <span className="value">{step.newRemainder}</span>
                        <span className="operator">{step.canDivide ? "≥" : "&lt;"}</span>
                        <span className="value">{step.divisor}</span>
                      </div>
                    </div>

                    <div className={`step-row result-row ${step.canDivide ? "can-divide" : "cannot-divide"}`}>
                      <span className="step-label-sm">Quotient Bit:</span>
                      <span className="quotient-bit">{step.quotientBit}</span>
                      <span className="annotation">
                        {step.canDivide ? `Remainder becomes ${step.actualRemainder}` : "Keep remainder as is"}
                      </span>
                    </div>

                    <div className="step-row final-quotient">
                      <span className="step-label-sm">Quotient so far:</span>
                      <code className="quotient-binary">{step.partialQuotient.toString(2).padStart(step.step, "0")}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="div-final-result">
            <h4>Division Result</h4>
            <div className="result-box">
              <div className="result-row-item">
                <span className="label">Quotient:</span>
                <span className="value">{breakdown.finalQuotient}</span>
                <span className="binary">{breakdown.finalQuotient.toString(2)}</span>
              </div>
              <div className="result-row-item">
                <span className="label">Remainder:</span>
                <span className="value">{breakdown.finalRemainder}</span>
                <span className="binary">{breakdown.finalRemainder.toString(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSteps && activeStep >= 0 && steps[activeStep] && (
        <div className="step-details">
          <h4>Step {activeStep + 1}</h4>
          <div className="step-calc">
            {type === "addition" && (
              <>
                <div>⊕ {steps[activeStep]?.bitA} ⊕ {steps[activeStep]?.bitB} = {steps[activeStep]?.xor}</div>
                <div>& {steps[activeStep]?.bitA} & {steps[activeStep]?.bitB} = {steps[activeStep]?.and}</div>
                <div>Sum: {steps[activeStep]?.sum} | Carry: {steps[activeStep]?.newCarry}</div>
              </>
            )}
            {type === "subtraction" && (
              <>
                <div>Diff: {steps[activeStep]?.bitA} − {steps[activeStep]?.borrow} = {steps[activeStep]?.diff}</div>
                <div>Borrow? {steps[activeStep]?.diff} &lt; {steps[activeStep]?.bitB} = {steps[activeStep]?.needsBorrow ? "YES" : "NO"}</div>
                <div>Result: {steps[activeStep]?.result}</div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="arithmetic-legend">
        {type === "addition" && (
          <>
            <div className="legend-item">⊕ XOR: Sum</div>
            <div className="legend-item">& AND: Carry</div>
            <div className="legend-item">→ Propagate</div>
          </>
        )}
        {type === "subtraction" && (
          <>
            <div className="legend-item">− Difference</div>
            <div className="legend-item">⬇ Borrow</div>
            <div className="legend-item">→ Propagate</div>
          </>
        )}
        {type === "multiplication" && (
          <>
            <div className="legend-item">× Shift</div>
            <div className="legend-item">+ Add</div>
            <div className="legend-item">= Sum</div>
          </>
        )}
        {type === "division" && (
          <>
            <div className="legend-item">÷ Divide</div>
            <div className="legend-item">&ge; Check</div>
            <div className="legend-item">Q Quotient</div>
          </>
        )}
      </div>

      <div className="result-summary">
        {type === "addition" && `${num1} + ${num2} = ${result}`}
        {type === "subtraction" && `${num1} − ${num2} = ${result}`}
        {type === "multiplication" && `${num1} × ${num2} = ${result}`}
        {type === "division" && `${num1} ÷ ${num2} = ${result}`}
      </div>
    </div>
  );
};

export default ArithmeticBreakdownVisualizer;
