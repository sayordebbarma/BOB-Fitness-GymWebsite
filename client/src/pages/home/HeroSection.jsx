import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Heading lines animate up one by one
      tl.fromTo(
        headingRef.current.querySelectorAll(".hero-line"),
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" },
      )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ctaRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );

      // Scroll indicator bounce loop
      gsap.to(scrollRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
        delay: 1.5,
      });

      // Parallax on hero background number
      gsap.to(".hero-bg-text", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="bg-dark relative flex min-h-screen flex-col justify-center overflow-hidden px-8 lg:px-24"
    >
      {/* Giant background text */}
      <div className="hero-bg-text pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-display text-[20vw] whitespace-nowrap text-white opacity-[0.02]">
          STRONGER
        </span>
      </div>

      {/* Accent line */}
      <div className="bg-primary absolute top-0 left-0 h-full w-1" />

      <div className="relative z-10 max-w-6xl">
        <p className="text-primary font-display mb-6 text-sm tracking-[0.4em] uppercase">
          Est. 2020 · Premium Fitness
        </p>

        <div ref={headingRef} className="mb-8 overflow-hidden">
          {["FORGE", "YOUR", "BODY."].map((word) => (
            <div key={word} className="overflow-hidden">
              <span
                className={`hero-line font-display block leading-none ${
                  word === "BODY." ? "text-primary" : "text-white"
                } text-[12vw] lg:text-[10vw]`}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <p
          ref={subRef}
          className="mb-10 max-w-lg text-xl leading-relaxed text-gray-400"
        >
          Premium fitness facility built for those who refuse to settle. Join a
          community where results are the only language spoken.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <Link
            to="/register"
            className="bg-primary text-dark font-display px-10 py-4 text-xl tracking-widest transition-colors hover:bg-yellow-300"
          >
            START TODAY
          </Link>
          <Link
            to="/membership"
            className="font-display hover:border-primary hover:text-primary border border-gray-600 px-10 py-4 text-xl tracking-widest text-white transition-colors"
          >
            VIEW PLANS
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-8 flex flex-col items-center gap-2 lg:left-24"
      >
        <span className="text-xs tracking-[0.3em] text-gray-600 uppercase">
          Scroll
        </span>
        <div className="h-12 w-px bg-linear-to-b from-gray-600 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
