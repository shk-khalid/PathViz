import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<PathfindingVisualizer />} />
        </Routes>
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;