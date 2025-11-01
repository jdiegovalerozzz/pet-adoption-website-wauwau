import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adoption from "./pages/Adoption";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopt" element={<Adoption />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
