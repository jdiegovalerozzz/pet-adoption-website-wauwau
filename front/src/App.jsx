import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adoption from "./pages/Adoption";
import PetDetail from "./pages/PetDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopt" element={<Adoption />} />
        <Route path="/pet/:id" element={<PetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
