import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: "2K+", label: "Active Members" },
  { number: "15+", label: "Expert Trainers" },
  { number: "50+", label: "Weekly Classes" },
  { number: "98%", label: "Satisfaction Rate" },
];

const StatsSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );

      // Number count-up animation
      document.querySelectorAll(".stat-number").forEach((el) => {
        const target = el.getAttribute("data-target");
        const isPercent = target.includes("%");
        const isPlus = target.includes("+");
        const num = parseInt(target);

        gsap.fromTo(
          { val: 0 },
          { val: num },
          {
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent =
                Math.round(this.targets()[0].val) +
                (isPlus ? "+" : isPercent ? "%" : "");
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      });

      // Video reveal
      gsap.fromTo(
        videoRef.current,
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: videoRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary">
      {/* Stats grid */}
      <div className="section-padding">
        <div className="container-wide grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(({ number, label }) => (
            <div key={label} className="stat-item text-center">
              <p
                className="stat-number font-display text-dark text-6xl lg:text-7xl"
                data-target={number}
              >
                {number}
              </p>
              <p className="text-dark/60 mt-2 text-sm tracking-widest uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Video */}
      <div ref={videoRef} className="container-wide px-8 pb-12 lg:px-0">
        <div className="relative mx-auto max-w-4xl">
          {/* Corner accents */}
          <div className="border-black/30 absolute -top-4 -left-4 z-10 h-8 w-8 border-t-2 border-l-2" />
          <div className="border-black/30 absolute -top-4 -right-4 z-10 h-8 w-8 border-t-2 border-r-2" />
          <div className="border-black/30 absolute -bottom-4 -left-4 z-10 h-8 w-8 border-b-2 border-l-2" />
          <div className="border-black/30 absolute -right-4 -bottom-4 z-10 h-8 w-8 border-r-2 border-b-2" />

          <div
            className="overflow-hidden rounded-xl"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/videos/gym-tour.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
