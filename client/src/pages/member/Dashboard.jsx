import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const StatCard = ({ label, value, sub, accent }) => (
  <div className="stat-card bg-surface border border-border p-6 flex flex-col gap-2">
    <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
    <p className={`font-display text-4xl ${accent ? 'text-primary' : 'text-white'}`}>{value}</p>
    {sub && <p className="text-gray-600 text-xs">{sub}</p>}
  </div>
);

const MemberDashboard = () => {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setMemberData(data.user);
      } catch {
        setMemberData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // GSAP entrance
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.dash-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo('.stat-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.dash-section',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.2'
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const getMembershipDaysLeft = () => {
    if (!memberData?.membershipExpiry) return null;
    const diff = new Date(memberData.membershipExpiry) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getMembershipDaysLeft();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="dash-header mb-10">
        <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Welcome back</p>
        <h1 className="font-display text-5xl text-white tracking-wider">
          {user?.name?.toUpperCase()}
        </h1>
      </div>

      {/* Membership status banner */}
      {memberData?.membershipStatus === 'none' && (
        <div className="dash-section bg-primary/10 border border-primary/30 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-primary font-display tracking-widest text-lg">NO ACTIVE MEMBERSHIP</p>
            <p className="text-gray-400 text-sm mt-1">Subscribe to a plan to unlock full access.</p>
          </div>
          <Link
            to="/membership"
            className="bg-primary text-dark font-display tracking-widest px-8 py-3 hover:bg-yellow-300 transition-colors whitespace-nowrap"
          >
            VIEW PLANS
          </Link>
        </div>
      )}

      {memberData?.membershipStatus === 'active' && daysLeft <= 7 && (
        <div className="dash-section bg-red-500/10 border border-red-500/30 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-red-400 font-display tracking-widest text-lg">MEMBERSHIP EXPIRING SOON</p>
            <p className="text-gray-400 text-sm mt-1">Only {daysLeft} days left. Renew to keep your access.</p>
          </div>
          <Link
            to="/membership"
            className="bg-red-500 text-white font-display tracking-widest px-8 py-3 hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            RENEW NOW
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-px">
        <StatCard
          label="Membership Plan"
          value={memberData?.membershipPlan?.name || 'None'}
          sub="Current plan"
          accent={!!memberData?.membershipPlan}
        />
        <StatCard
          label="Status"
          value={memberData?.membershipStatus?.toUpperCase() || 'NONE'}
          sub="Membership status"
          accent={memberData?.membershipStatus === 'active'}
        />
        <StatCard
          label="Days Remaining"
          value={daysLeft ?? '—'}
          sub={memberData?.membershipExpiry
            ? `Expires ${new Date(memberData.membershipExpiry).toLocaleDateString()}`
            : 'No active plan'
          }
          accent={daysLeft > 7}
        />
        <StatCard
          label="Member Since"
          value={new Date(memberData?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          sub="Join date"
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mt-px">

        {/* Profile info */}
        <div className="dash-section bg-surface p-8">
          <p className="font-display text-xl tracking-widest text-white mb-6">PROFILE</p>
          <div className="flex flex-col gap-4">
            {[
              ['Full Name', memberData?.name],
              ['Email', memberData?.email],
              ['Role', memberData?.role?.toUpperCase()],
              ['Account', memberData?.isActive ? 'Active' : 'Inactive'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <span className="text-gray-500 text-xs uppercase tracking-widest">{label}</span>
                <span className="text-white text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership details */}
        <div className="dash-section bg-surface p-8">
          <p className="font-display text-xl tracking-widest text-white mb-6">MEMBERSHIP DETAILS</p>

          {memberData?.membershipStatus === 'active' ? (
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 border border-primary/20 p-4">
                <p className="text-primary font-display text-3xl">{memberData.membershipPlan?.name?.toUpperCase()}</p>
                <p className="text-gray-400 text-sm mt-1">₹{memberData.membershipPlan?.price}/month</p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2">
                {memberData.membershipPlan?.features?.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="text-primary text-sm">✓</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>

              {/* Expiry bar */}
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-xs uppercase tracking-widest">Time remaining</span>
                  <span className="text-white text-xs">{daysLeft} / 30 days</span>
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-center">
              <p className="text-gray-600 text-sm">No active membership plan.</p>
              <Link
                to="/membership"
                className="border border-primary text-primary font-display tracking-widest px-8 py-3 hover:bg-primary hover:text-dark transition-colors"
              >
                BROWSE PLANS
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;