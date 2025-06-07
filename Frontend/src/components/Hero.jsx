import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate()

  return (
    <section className="bg-[#060A14] w-full min-h-screen flex justify-between items-center">
      <div className="w-1/2 text-[#F1F6F9] ">
        <h1 className="text-5xl font-bold my-6">
          Your journey to coding mastery starts here.
        </h1>
        <p className="pr-16">
          Step into a platform built for problem-solvers, dreamers, and future
          developers. Our challenges are crafted to sharpen your logic, speed,
          and confidence.
        </p>
        <p>— one problem at a time.</p>
        <button
          onClick={() => navigate("/signup")}
          className="text-[#F1F6F9] bg-[#0B645D] md:font-bold my-8 px-4 py-2 rounded-md hover:bg-[#F1F6F9] hover:text-[#060A14]"
        >
          Get Started
        </button>
      </div>
      <div className="w-1/2 pt-24 flex justify-end">
        <img
          src="/src\assets\imgOne.svg"
          alt="404 image"
          className="max-w-[550px]"
        />
      </div>
    </section>
  );
}

export default Hero;
