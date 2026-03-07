import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Basic",
    price: "499",
    features: ["Gym floor access", "Locker room", "Free parking"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "999",
    features: [
      "Everything in Basic",
      "Unlimited classes",
      "Sauna & pool",
      "1 PT session/mo",
    ],
    highlighted: true,
  },
  {
    name: "Elite",
    price: "1999",
    features: [
      "Everything in Pro",
      "4 PT sessions/mo",
      "Nutrition consult",
      "24/7 access",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-title",
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
        ".plan-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface section-padding">
      <div className="container-wide">
        <div className="pricing-title mb-16 text-center">
          <p className="section-label">Membership Plans</p>
          <h2 className="font-display text-6xl leading-none text-white lg:text-7xl">
            PICK YOUR
            <br />
            <span className="text-gray-600">LEVEL.</span>
          </h2>
        </div>

        <div className="bg-border grid grid-cols-1 gap-px md:grid-cols-3">
          {plans.map(({ name, price, features, highlighted }) => (
            <div
              key={name}
              className={`plan-card relative flex flex-col p-10 ${
                highlighted ? "bg-primary" : "bg-dark"
              }`}
            >
              {highlighted && (
                <span className="font-display bg-dark text-primary absolute top-4 right-4 px-3 py-1 text-xs tracking-widest">
                  POPULAR
                </span>
              )}

              <p
                className={`font-display mb-2 text-sm tracking-[0.4em] uppercase ${
                  highlighted ? "text-dark/60" : "text-gray-500"
                }`}
              >
                {name}
              </p>

              <div className="mb-8">
                <span
                  className={`font-display text-7xl ${highlighted ? "text-dark" : "text-white"}`}
                >
                  ₹{price}
                </span>
                <span
                  className={`ml-1 text-sm ${highlighted ? "text-dark/60" : "text-gray-500"}`}
                >
                  /month
                </span>
              </div>

              <ul className="mb-10 flex flex-1 flex-col gap-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className={highlighted ? "text-dark" : "text-primary"}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${highlighted ? "text-dark/80" : "text-gray-400"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`font-display py-4 text-center tracking-widest transition-all ${
                  highlighted
                    ? "bg-dark text-primary hover:bg-gray-900"
                    : "border-border hover:border-primary hover:text-primary border text-white"
                }`}
              >
                GET STARTED
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
