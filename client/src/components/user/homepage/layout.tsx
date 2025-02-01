"use client";
import React from "react";
import { motion } from "framer-motion";
import HeroSection from "./heroSection";
import DealsContainer from "../topDeals/dealsContainer";
import Footer from "../footer/footer";

function HomePageLayout() {
  const demoDivs = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    text: `Demo Div ${index + 1}`,
  }));

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeroSection />
      <DealsContainer/>
      {/* <div className="flex flex-col items-center mt-10 space-y-6">
        {demoDivs.map((div) => (
          <motion.div
            key={div.id}
            className="w-3/4 bg-blue-500 text-white h-96 p-8 rounded-md shadow-md text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {div.text}
          </motion.div>
        ))}
      </div> */}
      <Footer/>
    </div>
  );
}

export default HomePageLayout;
