import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

gsap.registerPlugin(ScrollTrigger);

const Membership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/memberships');
        setPlans(data.memberships);
      } catch {
        toast.error('Failed to load membership plans');
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
      gsap.fromTo('.membership-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );

      gsap.fromTo('.plan-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.plans-grid', start: 'top 80%' }
        }
      );

      gsap.fromTo('.faq-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.faq-section', start: 'top 80%' }
        }
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

    setSubscribing(planId);
    try {
      await api.post(`/memberships/subscribe/${planId}`);
      toast.success('Membership activated successfully! 💪');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(null);
    }
  };

  const faqs = [
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. No contracts, no lock-ins. Cancel your membership from your dashboard at any time.',
    },
    {
      q: 'Can I upgrade my plan?',
      a: 'Absolutely. You can upgrade or downgrade your plan anytime from your member dashboard.',
    },
    {
      q: 'Is there a joining fee?',
      a: 'No joining fees. You only pay the monthly membership price listed on the plan.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept all major cards, UPI, and net banking via our secure payment gateway.',
    },
  ];

  return (
    <div ref={containerRef} className="bg-dark min-h-screen">

      {/* Header */}
      <div className="membership-header section-padding bg-surface border-b border-border">
        <div className="container-wide">
          <p className="section-label">Membership Plans</p>
          <h1 className="font-display text-6xl lg:text-8xl text-white leading-none">
            PICK YOUR<br />
            <span className="text-gray-600">LEVEL.</span>
          </h1>
          <p className="text-gray-400 text-lg mt-6 max-w-xl leading-relaxed">
            No contracts. No hidden fees. Just pure access to the best fitness facility in town.
            Upgrade or cancel anytime.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="plans-grid grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {plans.map((plan, index) => {
                const isHighlighted = plan.name === 'Pro';
                const isCurrentPlan = user?.membershipPlan === plan._id;

                return (
                  <div
                    key={plan._id}
                    className={`plan-card p-10 flex flex-col relative ${
                      isHighlighted ? 'bg-primary' : 'bg-dark'
                    }`}
                  >
                    {isHighlighted && (
                      <span className="absolute top-4 right-4 text-xs font-display tracking-widest bg-dark text-primary px-3 py-1">
                        MOST POPULAR
                      </span>
                    )}

                    {isCurrentPlan && (
                      <span className="absolute top-4 left-4 text-xs font-display tracking-widest bg-primary text-dark px-3 py-1">
                        CURRENT PLAN
                      </span>
                    )}

                    <p className={`font-display text-sm tracking-[0.4em] uppercase mb-2 ${
                      isHighlighted ? 'text-dark/60' : 'text-gray-500'
                    }`}>
                      {plan.name}
                    </p>

                    <div className="mb-8">
                      <span className={`font-display text-7xl ${isHighlighted ? 'text-dark' : 'text-white'}`}>
                        ₹{plan.price}
                      </span>
                      <span className={`text-sm ml-1 ${isHighlighted ? 'text-dark/60' : 'text-gray-500'}`}>
                        /month
                      </span>
                    </div>

                    <ul className="flex flex-col gap-3 flex-1 mb-10">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3">
                          <span className={isHighlighted ? 'text-dark' : 'text-primary'}>✓</span>
                          <span className={`text-sm ${isHighlighted ? 'text-dark/80' : 'text-gray-400'}`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={subscribing === plan._id || isCurrentPlan}
                      className={`font-display tracking-widest py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isHighlighted
                          ? 'bg-dark text-primary hover:bg-gray-900'
                          : 'border border-border text-white hover:border-primary hover:text-primary'
                      }`}
                    >
                      {subscribing === plan._id
                        ? 'PROCESSING...'
                        : isCurrentPlan
                        ? 'CURRENT PLAN'
                        : 'GET STARTED'
                      }
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
          <h2 className="font-display text-5xl text-white mb-12">WHAT YOU GET</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 text-gray-500 text-xs uppercase tracking-widest font-normal w-1/2">Feature</th>
                  {plans.map(plan => (
                    <th key={plan._id} className={`py-4 text-center font-display tracking-widest text-sm ${
                      plan.name === 'Pro' ? 'text-primary' : 'text-white'
                    }`}>
                      {plan.name.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'Gym floor access',
                  'Locker room access',
                  'Free parking',
                  'Unlimited group classes',
                  'Access to sauna & pool',
                  '1 free PT session/month',
                  '4 PT sessions/month',
                  'Nutrition consultation',
                  'Priority booking',
                  '24/7 gym access',
                ].map((feature, i) => (
                  <tr key={feature} className={`border-b border-border ${i % 2 === 0 ? 'bg-dark/50' : ''}`}>
                    <td className="py-4 text-gray-400 text-sm">{feature}</td>
                    {plans.map(plan => (
                      <td key={plan._id} className="py-4 text-center">
                        {plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase().split(' ')[0]))
                          ? <span className="text-primary text-lg">✓</span>
                          : <span className="text-gray-700 text-lg">—</span>
                        }
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
          <h2 className="font-display text-5xl text-white mb-12">
            COMMON<br />
            <span className="text-gray-600">QUESTIONS.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {faqs.map(({ q, a }) => (
              <div key={q} className="faq-item bg-dark p-8 hover:bg-surface transition-colors">
                <p className="font-display text-xl text-white tracking-wider mb-3">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Membership;