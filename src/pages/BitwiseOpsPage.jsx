import React from "react";
import { isPowerOfTwo } from "../utils/bitOperations";



const BitwiseOpsPage = () => {
  return (
    <div className="page-container">
      <h2>Bitwise Operations</h2>
      <PowerOfTwoChecker />
      {/* Additional components like SetBitTool can be added below */}
    </div>
  );
};

export default BitwiseOpsPage;
