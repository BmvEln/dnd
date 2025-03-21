import "./style.less";
import { ReactNode } from "react";

function Heading({ children }: { children: ReactNode }) {
  return <div className="Heading">{children}</div>;
}

export default Heading;
