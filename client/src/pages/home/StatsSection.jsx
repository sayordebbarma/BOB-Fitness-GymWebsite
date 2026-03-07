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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary section-padding">
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
    </section>
  );
};

export default StatsSection;
