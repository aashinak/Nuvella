import { ReactNode } from "react";

interface LayoutContentWrapperProps {
  children: ReactNode;
}

const LayoutContentWrapper: React.FC<LayoutContentWrapperProps> = ({
  children,
}) => {
  return <div className="flex w-full h-[92vh]">{children}</div>;
};

export default LayoutContentWrapper;
