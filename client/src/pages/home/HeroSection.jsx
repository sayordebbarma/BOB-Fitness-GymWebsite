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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

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
        );

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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-8 pt-24 lg:px-24"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Left gradient */}
      <div className="from-dark via-dark/70 absolute inset-0 bg-linear-to-r to-transparent" />

      {/* Giant background text */}
      <div className="hero-bg-text pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span
          className="font-display text-[20vw] tracking-widest whitespace-nowrap"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.2)",
            backgroundImage: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.12) 0%,
              rgba(255,255,255,0.1) 25%,
              rgba(255,255,255,0.15) 50%,
              rgba(255,255,255,0.1) 75%,
              rgba(255,255,255,0.15) 100%
              )`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            filter: "blur(0.4px)",
            textShadow: `
        0 1px 0 rgba(255,255,255,0.06),
        0 -1px 0 rgba(0,0,0,0.3),
        inset 0 1px 1px rgba(255,255,255,0.1)
      `,
          }}
        >
          STRONGER
        </span>
      </div>

      <div className="relative z-10 max-w-6xl">
        <p className="text-primary font-display mb-6 text-sm tracking-[0.4em] uppercase">
          Est. 2020 · Premium Fitness
        </p>

        <div ref={headingRef} className="mb-2 overflow-hidden">
          {["FORGE", "YOUR", "BODY."].map((word) => (
            <div key={word} className="overflow-hidden">
              <span
                className={`hero-line font-display block leading-none ${
                  word === "BODY." ? "text-primary" : "text-white"
                } text-[15vw] sm:text-[12vw] lg:text-[10vw]`}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <p
          ref={subRef}
          className="mb-6 max-w-lg text-sm leading-relaxed text-gray-300 lg:text-lg"
        >
          Premium fitness facility built for those who refuse to settle. Join a
          community where results are the only language spoken.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <Link
            to="/register"
            className="bg-primary text-dark font-display px-8 py-4 text-lg tracking-widest transition-colors hover:bg-yellow-300 lg:px-10 lg:text-xl"
          >
            START TODAY
          </Link>
          <Link
            to="/membership"
            className="font-display hover:border-primary hover:text-primary border border-gray-600 px-8 py-4 text-lg tracking-widest text-white backdrop-blur-sm transition-colors lg:px-10 lg:text-xl"
          >
            VIEW PLANS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
