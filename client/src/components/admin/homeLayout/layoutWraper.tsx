import React from "react";

function LayoutWraper({ children }) {
  return <div className="w-full h-screen flex flex-col ">{children}</div>;
}

export default LayoutWraper;
