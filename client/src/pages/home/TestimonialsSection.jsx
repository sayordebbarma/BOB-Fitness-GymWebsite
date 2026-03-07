import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Lost 18kg in 4 months",
    quote:
      "The trainers here genuinely care. I went from barely moving to deadlifting twice my bodyweight.",
    avatar: "RS",
  },
  {
    name: "Priya Nair",
    role: "Elite Member since 2023",
    quote:
      "Best investment I have made. The 24/7 access fits perfectly around my night shift schedule.",
    avatar: "PN",
  },
  {
    name: "Arjun Mehta",
    role: "Competitive Powerlifter",
    quote:
      "Elite equipment, serious atmosphere. This is where real lifters train.",
    avatar: "AM",
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-title",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );

      gsap.fromTo(
        ".testimonial-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-dark section-padding">
      <div className="container-wide">
        <div className="testimonial-title mb-16">
          <p className="section-label">Member Stories</p>
          <h2 className="font-display text-6xl leading-none text-white lg:text-7xl">
            REAL
            <br />
            <span className="text-gray-600">RESULTS.</span>
          </h2>
        </div>

        <div className="bg-border grid grid-cols-1 gap-px md:grid-cols-3">
          {testimonials.map(({ name, role, quote, avatar }) => (
            <div
              key={name}
              className="testimonial-card bg-dark hover:bg-surface p-8 transition-colors duration-300"
            >
              <p className="text-primary font-display mb-4 text-4xl">"</p>
              <p className="mb-8 text-sm leading-relaxed text-gray-300 italic">
                {quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-none">
                  <span className="font-display text-dark text-sm">
                    {avatar}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
