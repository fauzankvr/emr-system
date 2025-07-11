import React, { useRef } from "react";

const Footer = () => {
  const formRef = useRef(null);

  return (
    <footer
      id="enroll-now-footer"
      className="footer bg-[#0d1b2a] text-[#f1faee] py-20 px-4 text-center"
    >
      <div className="footer-enroll-form fade-in max-w-xl mx-auto mb-12">
        <h4 className="text-xl md:text-2xl font-semibold mb-3">
          Ready to Digitalize Your Practice?
        </h4>
        <p className="text-[#bbb] mb-8">
          Fill out the form below to begin your journey with SUHAIM SOFT. We'll
          get in touch with you shortly.
        </p>
        <form
          ref={formRef}
          action="https://formspree.io/f/manyyrbr"
          method="POST"
          className="space-y-5"
        >
          <div className="form-group text-left">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              required
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              required
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="phone" className="block mb-2 font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. +91 8891479505"
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              required
            />
          </div>
          <button
            type="submit"
            className="form-submit-btn w-full py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] hover:-translate-y-1 transition-all duration-300"
          >
            Enroll Now
          </button>
        </form>
      </div>
      <div className="social-icons mb-5">
        <a
          href="https://www.facebook.com/share/16WXpVs2Js/"
          aria-label="Facebook"
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          href="#"
          id="footer-wa-link"
          aria-label="Chat on WhatsApp"
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href="https://www.instagram.com/suhaimsoft?igsh=MWpzazg4emk2N2R3bQ=="
          aria-label="Instagram"
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      <p>© 2025 SUHAIM SOFT Systems. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
