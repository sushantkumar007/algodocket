import React from "react";

function Container({ children }) {
  return (
    <div className="w-full bg-[#060A14]">
      <div className="w-[1260px]  mx-auto">{children}</div>
    </div>
  );
}

export default Container;
