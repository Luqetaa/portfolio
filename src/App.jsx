import { useState } from "react";
import BootScreen from "./components/BootScreen";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);

  return (
    <>
      {!bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {bootFinished && (
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-green-400 text-3xl">
            PORTFOLIO SYSTEM ONLINE
          </h1>
        </div>
      )}
    </>
  );
}