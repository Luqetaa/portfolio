import { useEffect, useState } from "react";

export function useTerminalType(text, speed = 35, enabled = true) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled || displayedText.length === text.length) {
      if (displayedText === text) setIsComplete(true);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, text, speed, enabled]);

  const reset = () => {
    setDisplayedText("");
    setIsComplete(false);
  };

  return { displayedText, isComplete, reset };
}
