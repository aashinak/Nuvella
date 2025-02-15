
import React from "react";
import HeroSection from "./heroSection";
import DealsContainer from "../topDeals/dealsContainer";
import Footer from "../footer/footer";

function HomePageLayout() {

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeroSection />
      <DealsContainer/>
      <Footer/>
    </div>
  );
}

export default HomePageLayout;
