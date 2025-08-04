import React, { useState } from "react";
import { Icon } from "@iconify/react";

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <div
        className={`absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-[#075E54] text-white p-4 flex items-center relative">
          <img
            src="/main_icon.png"
            alt="SUHAIM SOFT Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-white object-cover"
          />
          <div>
            <h4 className="font-semibold">SUHAIM SOFT</h4>
          </div>
          <button
            onClick={togglePopup}
            className="absolute top-2 right-2 text-2xl opacity-80"
          >
            ×
          </button>
        </div>
        <div
          className="p-5 bg-[#E5DDD5] min-h-[100px]"
          style={{
            backgroundImage:
              "url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)",
          }}
        >
          <p className="bg-white p-3 rounded-lg rounded-tl-none inline-block max-w-[80%] text-sm text-[#333]">
            WELCOME TO SUHAIM SOFT HOW CAN I HELP YOU
          </p>
        </div>
        <div className="p-4 bg-[#f0f0f0] text-center">
          <a
            href="https://wa.me/918891479505?text=WELCOME%20TO%20SUHAIM%20SOFT%20HOW%20CAN%20I%20HELP%20YOU"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all duration-300"
          >
            <Icon icon="mdi:whatsapp" className="text-lg" />
            Start Chat
          </a>
        </div>
      </div>
      <div
        className="bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer shadow-lg hover:scale-110 transition-all duration-300"
        onClick={togglePopup}
      >
        <Icon icon="mdi:whatsapp" className="text-3xl" />
      </div>
    </div>
  );
};

export default WhatsAppWidget;
