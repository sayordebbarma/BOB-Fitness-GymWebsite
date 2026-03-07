import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-primary section-padding relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="font-display text-dark pointer-events-none text-[30vw] leading-none select-none">
          GO
        </div>
      </div>

      <div className="cta-content container-wide relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-dark mb-4 text-6xl leading-none lg:text-8xl">
            READY TO
            <br />
            START?
          </h2>
          <p className="text-dark/60 max-w-md text-lg">
            First month at 50% off. No contracts. Cancel anytime.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/register"
            className="bg-dark text-primary font-display px-12 py-5 text-center text-xl tracking-widest transition-colors hover:bg-gray-900"
          >
            JOIN NOW
          </Link>
          <Link
            to="/membership"
            className="border-dark text-dark font-display hover:bg-dark hover:text-primary border-2 px-12 py-5 text-center text-xl tracking-widest transition-colors"
          >
            SEE PLANS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
