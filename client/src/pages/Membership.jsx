import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import useRazorpay from "../hooks/useRazorpay";

gsap.registerPlugin(ScrollTrigger);

const Membership = () => {
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/memberships");
        setPlans(data.memberships);
      } catch {
        toast.error("Failed to load membership plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".membership-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      );

      gsap.fromTo(
        ".plan-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".plans-grid", start: "top 80%" },
        },
      );

      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-section", start: "top 80%" },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const handleSubscribe = async (planId) => {
    if (!user) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    await initiatePayment({
      membershipId: planId,
      onSuccess: () => navigate('/dashboard'),
    });
  };

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes. No contracts, no lock-ins. Cancel your membership from your dashboard at any time.",
    },
    {
      q: "Can I upgrade my plan?",
      a: "Absolutely. You can upgrade or downgrade your plan anytime from your member dashboard.",
    },
    {
      q: "Is there a joining fee?",
      a: "No joining fees. You only pay the monthly membership price listed on the plan.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major cards, UPI, and net banking via our secure payment gateway.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-dark min-h-screen">
      {/* Header */}
      <div className="membership-header bg-surface border-border border-b px-8 pt-32 pb-12 lg:px-24">
        <div className="container-wide">
          <p className="section-label">Membership Plans</p>
          <h1 className="font-display text-5xl leading-none text-white lg:text-7xl">
            PICK YOUR
            <br />
            <span className="text-gray-600">LEVEL.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400">
            No contracts. No hidden fees. Just pure access to the best fitness
            <br />
            facility in town. Upgrade or cancel anytime.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ) : (
            <div className="plans-grid bg-border grid grid-cols-1 gap-px md:grid-cols-3">
              {plans.map((plan, index) => {
                const isHighlighted = plan.name === "Pro";
                const isCurrentPlan = user?.membershipPlan === plan._id;

                return (
                  <div
                    key={plan._id}
                    className={`plan-card relative flex flex-col p-10 ${
                      isHighlighted ? "bg-primary" : "bg-dark"
                    }`}
                  >
                    {isHighlighted && (
                      <span className="font-display bg-dark text-primary absolute top-4 right-4 px-3 py-1 text-xs tracking-widest">
                        MOST POPULAR
                      </span>
                    )}

                    {isCurrentPlan && (
                      <span className="font-display bg-primary text-dark absolute top-4 left-4 px-3 py-1 text-xs tracking-widest">
                        CURRENT PLAN
                      </span>
                    )}

                    <p
                      className={`font-display mb-2 text-sm tracking-[0.4em] uppercase ${
                        isHighlighted ? "text-dark/60" : "text-gray-500"
                      }`}
                    >
                      {plan.name}
                    </p>

                    <div className="mb-8">
                      <span
                        className={`font-display text-7xl ${isHighlighted ? "text-dark" : "text-white"}`}
                      >
                        ₹{plan.price}
                      </span>
                      <span
                        className={`ml-1 text-sm ${isHighlighted ? "text-dark/60" : "text-gray-500"}`}
                      >
                        /month
                      </span>
                    </div>

                    <ul className="mb-10 flex flex-1 flex-col gap-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3">
                          <span
                            className={
                              isHighlighted ? "text-dark" : "text-primary"
                            }
                          >
                            ✓
                          </span>
                          <span
                            className={`text-sm ${isHighlighted ? "text-dark/80" : "text-gray-400"}`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={subscribing === plan._id || isCurrentPlan}
                      className={`font-display py-4 tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        isHighlighted
                          ? "bg-dark text-primary hover:bg-gray-900"
                          : "border-border hover:border-primary hover:text-primary border text-white"
                      }`}
                    >
                      {subscribing === plan._id
                        ? "PROCESSING..."
                        : isCurrentPlan
                          ? "CURRENT PLAN"
                          : "GET STARTED"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="section-padding bg-surface">
        <div className="container-wide">
          <p className="section-label">Compare Plans</p>
          <h2 className="font-display mb-12 text-5xl text-white">
            WHAT YOU GET
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-border border-b">
                  <th className="w-1/2 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan._id}
                      className={`font-display py-4 text-center text-sm tracking-widest ${
                        plan.name === "Pro" ? "text-primary" : "text-white"
                      }`}
                    >
                      {plan.name.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Gym floor access",
                  "Locker room access",
                  "Free parking",
                  "Unlimited group classes",
                  "Access to sauna & pool",
                  "1 free PT session/month",
                  "4 PT sessions/month",
                  "Nutrition consultation",
                  "Priority booking",
                  "24/7 gym access",
                ].map((feature, i) => (
                  <tr
                    key={feature}
                    className={`border-border border-b ${i % 2 === 0 ? "bg-dark/50" : ""}`}
                  >
                    <td className="py-4 text-sm text-gray-400">{feature}</td>
                    {plans.map((plan) => (
                      <td key={plan._id} className="py-4 text-center">
                        {plan.features.some((f) =>
                          f
                            .toLowerCase()
                            .includes(feature.toLowerCase().split(" ")[0]),
                        ) ? (
                          <span className="text-primary text-lg">✓</span>
                        ) : (
                          <span className="text-lg text-gray-700">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section section-padding">
        <div className="container-wide">
          <p className="section-label">FAQ</p>
          <h2 className="font-display mb-12 text-5xl text-white">
            COMMON
            <br />
            <span className="text-gray-600">QUESTIONS.</span>
          </h2>

          <div className="bg-border grid grid-cols-1 gap-px md:grid-cols-2">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="faq-item bg-dark hover:bg-surface p-8 transition-colors"
              >
                <p className="font-display mb-3 text-xl tracking-wider text-white">
                  {q}
                </p>
                <p className="text-sm leading-relaxed text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
