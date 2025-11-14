import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="h-screen w-screen relative">
      <div>
        <h1>About the artist..</h1>
      </div>
      <div className="flex w-full h-full items-center justify-between">
        <div className="relative flex-1">
          {/* <Image
            src={"/about/man.webp"}
            className="w-full h-full object-cover"
            height={500}
            width={500}
            alt="artist"
          /> */}
        </div>
        <div className="flex-1">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores
            sapiente illo sunt provident iste suscipit eos nam odit, animi quos.
            Quisquam, doloribus! Quisquam, doloribus! Lorem, ipsum dolor sit
            amet consectetur adipisicing elit. Maiores sapiente illo sunt
            provident iste suscipit eos nam odit, animi quos. Quisquam,
            doloribus! Quisquam, doloribus!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
