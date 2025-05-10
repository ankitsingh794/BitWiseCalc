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
