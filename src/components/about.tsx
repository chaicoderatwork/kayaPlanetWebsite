"use client";

import { useInView } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";

export const About = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            className="min-h-[100vh] bg-white pt-5 w-[100%] flex flex-col items-center gap-9 justify-center"
            aria-labelledby="about-heading"
        >
            <div
                ref={ref}
                className="flex lg:flex-row flex-col gap-9 w-[80%] items-stretch mt-9 py-9 justify-center"
                style={{
                    transform: isInView ? "none" : "translateX(-200px)",
                    opacity: isInView ? 1 : 0,
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
            >
                <div className="w-[100%] lg:w-[35%] h-auto relative">
                    <Image
                        className="self-center object-cover filter grayscale"
                        src="/about.jpg"
                        width={500}
                        height={500}
                        layout="responsive"
                        alt="Kaya Planet team at the salon"
                    />
                </div>

                <div className="lg:w-[25vw] md:text-2xl text-md font-light flex flex-col gap-4">
                    <h2 id="about-heading" className="text-3xl font-semibold">
                        About Kaya Planet Beauty Salon & Academy
                    </h2>
                    <p>
                        Welcome to Kaya Planet Beauty Salon, where luxury meets expertise. For the past nine years, we have been dedicated to providing exceptional beauty services to both men and women, ensuring that every visit is a transformative experience.
                    </p>
                    <p>
                        Our team consists of highly skilled artists who are passionate about their craft. Each stylist and technician brings a unique blend of creativity and professionalism, committed to delivering the highest standards of service. From cutting-edge hair design to rejuvenating skincare treatments, we tailor our offerings to meet the individual needs of our clients.
                    </p>
                    <p>
                        Our luxurious environment and personalized approach allow you to unwind and indulge in a sanctuary of style and relaxation. Join us, and let our experts elevate your beauty journey. Experience the difference at Kaya Planet Beauty Salon—where your beauty is our passion.
                    </p>
                </div>
            </div>
        </section>
    );
};
