import { useEffect, useRef, useState } from "react";

export default function CountUp({ end, duration = 2500, decimals = 0, suffix = "", separator = "," }) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end]);

  const formatted = count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return <span>{formatted}{suffix}</span>;
}