import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../../utils/api";

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/memberships");
        const order = ["Basic", "Pro", "Elite"];
        const sorted = data.memberships.sort(
          (a, b) => order.indexOf(a.name) - order.indexOf(b.name),
        );
        setPlans(sorted);
      } catch {
        // fail silently — section just won't render
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (loading || plans.length === 0) return;
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
        ".pricing-card",
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
  }, [loading, plans]);

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

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : (
<div className="bg-border grid grid-cols-1 gap-px md:grid-cols-3 items-stretch">
  {plans.map((plan) => {
    const highlighted = plan.name === 'Pro';

    return (
      <div
        key={plan._id}
        className={`pricing-card relative flex flex-col p-10 transition-all ${
          highlighted
            ? "bg-primary md:-my-8"
            : "bg-dark"
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
                    {plan.name}
                  </p>

                  <div className="mb-8">
                    <span
                      className={`font-display text-7xl ${highlighted ? "text-dark" : "text-white"}`}
                    >
                      ₹{plan.price}
                    </span>
                    <span
                      className={`ml-1 text-sm ${highlighted ? "text-dark/60" : "text-gray-500"}`}
                    >
                      /month
                    </span>
                  </div>

                  <ul className="mb-10 flex flex-1 flex-col gap-3">
                    {plan.features.map((f) => (
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
