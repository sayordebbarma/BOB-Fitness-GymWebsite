import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "🏋️",
    title: "World-Class Equipment",
    desc: "Over 200 pieces of premium equipment across 3 dedicated training floors.",
  },
  {
    icon: "👊",
    title: "Expert Trainers",
    desc: "Certified coaches who build programs around your unique goals and lifestyle.",
  },
  {
    icon: "🔥",
    title: "Intense Programs",
    desc: "HIIT, strength, cardio and hybrid programs designed for maximum results.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Log workouts, track PRs and monitor your transformation week by week.",
  },
  {
    icon: "🥗",
    title: "Nutrition Guidance",
    desc: "Personalized meal plans and nutrition coaching included in Pro and Elite tiers.",
  },
  {
    icon: "🕐",
    title: "24/7 Access",
    desc: "Train on your schedule. Elite members get round-the-clock facility access.",
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        ".features-title",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-dark section-padding">
      <div className="container-wide">
        <div className="features-title mb-16">
          <p className="section-label">Why Choose Us</p>
          <h2 className="font-display text-6xl leading-none text-white lg:text-7xl">
            EVERYTHING
            <br />
            <span className="text-gray-600">YOU NEED.</span>
          </h2>
        </div>

        <div className="bg-border grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="feature-card bg-dark hover:bg-surface group p-8 transition-colors duration-300"
            >
              <span className="mb-6 block text-4xl">{icon}</span>
              <h3 className="font-display group-hover:text-primary mb-3 text-2xl tracking-wider text-white transition-colors">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
