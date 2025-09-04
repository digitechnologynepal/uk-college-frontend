import { useEffect, useState } from "react";

export const SlidingTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        position: "absolute",
        right: "100%",
        marginRight: "8px",
        padding: "4px 8px",
        backgroundColor: "#02153b",
        color: "white",
        fontSize: "12px",
        borderRadius: "6px",
        whiteSpace: "nowrap",
        transform: visible ? "translateX(0)" : "translateX(40%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.5s ease-in-out",
        zIndex: -1,
      }}
    >
      {text}
    </span>
  );
};
