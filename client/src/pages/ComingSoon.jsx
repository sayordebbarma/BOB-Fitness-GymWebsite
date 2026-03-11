import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const ComingSoon = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        ".cs-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      )
        .fromTo(
          ".cs-title span",
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=0.2",
        )
        .fromTo(
          ".cs-sub",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".cs-btn",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        );

      // Pulse the accent line
      gsap.to(".cs-accent", {
        scaleY: 0.6,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
        transformOrigin: "bottom",
      });

      // Float the bg text
      gsap.to(".cs-bg-text", {
        y: -20,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8"
    >
      {/* Accent line */}
      <div className="cs-accent bg-primary absolute top-0 left-0 h-full w-1" />

      {/* Bg text */}
      <div className="cs-bg-text pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-display text-[18vw] whitespace-nowrap text-white opacity-[0.02]">
          SOON
        </span>
      </div>

      {/* Glow */}
      <div className="bg-primary absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="cs-label section-label mb-6">Under Construction</p>

        <div className="cs-title mb-6 overflow-hidden">
          <div className="flex flex-col items-center">
            {["COMING", "SOON."].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <span
                  className={`font-display block text-[14vw] leading-none lg:text-[12vw] ${
                    i === 1 ? "text-primary" : "text-white"
                  }`}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="cs-sub mb-10 max-w-md text-lg leading-relaxed text-gray-500">
          We're working hard to bring this feature to life. Check back soon —
          it'll be worth the wait.
        </p>

        <Link
          to="/dashboard"
          className="cs-btn bg-primary text-dark font-display px-10 py-4 text-lg tracking-widest transition-colors hover:bg-yellow-300"
        >
          ← BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
