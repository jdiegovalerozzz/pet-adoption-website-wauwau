import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adoption from "./pages/Adoption";
import PetDetail from "./pages/PetDetail";
import AdoptionFormP1 from "./pages/AdoptionFormP1";
import AdoptionFormP2 from "./pages/AdoptionFormP2";

import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/footer.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopt" element={<Adoption />} />
        <Route path="/pet/:id" element={<PetDetail />} />
        <Route path="/adopt/form/:id" element={<AdoptionFormP1 />} />
        <Route path="/adopt/form/:id/page2" element={<AdoptionFormP2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
