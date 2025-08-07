import React from "react";

const Header = () => {
  return (
    <header
      id="home"
      className="relative min-h-[95vh] flex items-center justify-center text-center text-[#f1faee] px-4 bg-[#0d1b2a]"
    >
      <div className="relative z-10 max-w-3xl bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-bold mb-5 animate-fadeInDown">
          Suhaim Soft
        </h1>
        <p className="text-base md:text-lg mb-10 font-light animate-fadeInUp">
          SUHAIM SOFT delivers smart, secure, and efficient Electronic Medical
          Records (EMR) to empower healthcare professionals and improve patient
          outcomes.
        </p>
        <a
          href="#features"
          className="inline-block px-8 py-3 bg-[#00a896] text-[#f1faee] font-semibold rounded-full border-2 border-[#00a896] shadow-lg hover:bg-[#02c39a] hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Learn More
        </a>
      </div>
    </header>
  );
};

export default Header;
