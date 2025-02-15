import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return <div className="w-full h-screen flex flex-col">{children}</div>;
};

export default LayoutWrapper;
