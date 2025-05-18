import { useEffect, useState } from "react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date().toLocaleString());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <p>{time}</p>;
};
export default LiveClock;
