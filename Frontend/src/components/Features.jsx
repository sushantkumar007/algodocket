import React from "react";
import FeaturesCard from "./FeaturesCard";
import imageTwo from "/src/assets/imgTwo.svg"
import imageThree from "/src/assets/imgThree.svg"
import imageFour from "/src/assets/imgFour.svg"

function Features() {
  return (
    <section className="mt-16" >
      <h1 className="text-center border-b-[0.5px] pb-4 text-6xl font-bold">Features</h1>
      <div className="w-full h-screen flex justify-between items-center">
        <FeaturesCard
        src={imageThree}
        heading="Submission Tracking to track your progress"
        paragraph="Every submission you make is recorded with real time feedback on performance, test cases, and accuracy. Revist past attempts and see how your coding skills improve over time"
      />
      <FeaturesCard
        src={imageTwo}
        heading="Multiple Programing Language Supported"
        paragraph="Our platform supports multiple languages like C++, JAVA, Javascript and Python so you can practice and submit in envvironment you are most comfortable with."
      />
      <FeaturesCard
        src={imageFour}
        heading="Daily Challenges to sharpen you skills"
        paragraph="A new problem every day to keep your brain active and your streak alive. Solve the daily challenge and build consistent problem solving habits"
      />
      </div>
    </section>
  );
}

export default Features;
