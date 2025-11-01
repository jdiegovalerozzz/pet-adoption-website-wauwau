import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyAdoptSection from "../components/WhyAdoptSection";
import ShelterSection from "../components/ShelterSection";
import CareSection from "../components/CareSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="site-root">
      <Navbar />
      <main>
        <HeroSection />
        <WhyAdoptSection />
        <ShelterSection />
        <CareSection />
      </main>
      <Footer />
    </div>
  );
}
