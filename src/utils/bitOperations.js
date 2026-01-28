// Adds two numbers using bitwise operators
export function bitwiseAdd(a, b) {
  while (b !== 0) {
    let carry = a & b;
    a = a ^ b;
    b = carry << 1;
  }
  return a;
}

// Subtracts b from a using bitwise operators
export function bitwiseSubtract(a, b) {
  while (b !== 0) {
    let borrow = (~a) & b;
    a = a ^ b;
    b = borrow << 1;
  }
  return a;
}

// Checks if a number is even using bitwise AND
export function isEven(n) {
  return (n & 1) === 0;
}

// Counts number of set bits (1s) in binary representation
export function countSetBits(n) {
  let count = 0;
  while (n) {
    n &= (n - 1);
    count++;
  }
  return count;
}

// Computes a % b when b is a power of 2
export function modPowerOfTwo(a, b) {
  if ((b & (b - 1)) !== 0) {
    return "Error: B is not a power of 2";
  }
  return a & (b - 1);
}


// Check if a number is a power of 2
export function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Multiply two numbers using bitwise operations
export function bitwiseMultiply(a, b) {
  let result = 0;
  let multiplier = b;

  while (multiplier > 0) {
    if (multiplier & 1) result += a;
    multiplier >>= 1;
    a <<= 1;
  }

  return result;
}

// Divide two numbers using bitwise operations
export function bitwiseDivide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  let quotient = 0;
  let divisor = b;
  let dividend = a;

  while (dividend >= divisor) {
    let tempDivisor = divisor, multiple = 1;

    while (dividend >= (tempDivisor << 1)) {
      tempDivisor <<= 1;
      multiple <<= 1;
    }

    dividend -= tempDivisor;
    quotient += multiple;
  }

  return quotient;
}

// Power(a,b)
export function myPow(x, n) {
  let nn = BigInt(n);

  if (nn < 0n) {
    nn = -nn;
    x = 1 / x;
  }

  return powHelp(x, nn);
}

// Helper function to get bit representation with padding
export function getPaddedBinary(num, bits = 8) {
  return num.toString(2).padStart(bits, '0');
}

// Get visualization steps for bitwise addition
export function getAdditionSteps(a, b) {
  const maxBits = Math.max(a.toString(2).length, b.toString(2).length) + 1;
  const binA = getPaddedBinary(a, maxBits);
  const binB = getPaddedBinary(b, maxBits);
  
  const steps = [];
  let carry = 0;
  let result = 0;
  
  for (let i = binA.length - 1; i >= 0; i--) {
    const bitA = parseInt(binA[i]);
    const bitB = parseInt(binB[i]);
    const sum = bitA + bitB + carry;
    const resultBit = sum % 2;
    carry = Math.floor(sum / 2);
    result = (resultBit << (binA.length - 1 - i)) | result;
    
    steps.push({
      bitA,
      bitB,
      carry: carry,
      result: resultBit,
      position: binA.length - 1 - i
    });
  }
  
  return { steps, binA, binB, result };
}

// Bitwise AND operation
export function bitwiseAND(a, b) {
  return a & b;
}

// Bitwise OR operation
export function bitwiseOR(a, b) {
  return a | b;
}

// Get visualization steps for bitwise AND operation
export function getANDSteps(a, b) {
  const maxBits = Math.max(a.toString(2).length, b.toString(2).length);
  const binA = getPaddedBinary(a, maxBits);
  const binB = getPaddedBinary(b, maxBits);
  
  const steps = [];
  for (let i = 0; i < binA.length; i++) {
    const bitA = parseInt(binA[i]);
    const bitB = parseInt(binB[i]);
    steps.push({
      bitA,
      bitB,
      result: bitA & bitB,
      position: i
    });
  }
  
  return { steps, binA, binB, result: a & b };
}

// Get visualization steps for bitwise OR operation
export function getORSteps(a, b) {
  const maxBits = Math.max(a.toString(2).length, b.toString(2).length);
  const binA = getPaddedBinary(a, maxBits);
  const binB = getPaddedBinary(b, maxBits);
  
  const steps = [];
  for (let i = 0; i < binA.length; i++) {
    const bitA = parseInt(binA[i]);
    const bitB = parseInt(binB[i]);
    steps.push({
      bitA,
      bitB,
      result: bitA | bitB,
      position: i
    });
  }
  
  return { steps, binA, binB, result: a | b };
}

function powHelp(x, n) {
  if (n === 0n) return 1.0;

  const half = powHelp(x, n / 2n);

  if (n % 2n === 0n) {
    return half * half;
  } else {
    return half * half * x;
  }
}
