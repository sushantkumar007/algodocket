import React from "react";
import { CodeXml } from "lucide-react";

function FeaturesCard({ src, heading, paragraph }) {
  return (
    <div className="w-[330px] border-[0.5px] min-h-[520px] rounded-2xl px-6 py-8 ">
      <div className="flex flex-col items-center rounded-2xl">
        <img 
          src={src} 
          alt="image not found" 
          className="w-[280px]" />
      </div>
      <h1 className="my-4 text-2xl font-bold">{heading}</h1>
      <p className="">{paragraph}</p>
    </div>
  );
}

export default FeaturesCard;
