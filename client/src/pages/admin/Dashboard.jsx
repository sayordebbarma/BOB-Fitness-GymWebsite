import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import api from "../../utils/api";

const StatCard = ({ label, value, sub, accent }) => (
  <div className="stat-card bg-surface border-border flex flex-col gap-2 border p-6">
    <p className="text-xs tracking-widest text-gray-500 uppercase">{label}</p>
    <p
      className={`font-display text-5xl ${accent ? "text-primary" : "text-white"}`}
    >
      {value}
    </p>
    {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const containerRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, membersRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/members"),
        ]);
        setStats(statsRes.data.stats);
        setMembers(membersRes.data.members.slice(0, 5)); // latest 5
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".dash-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          ".stat-card",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".dash-section",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
          "-=0.2",
        );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="dash-header mb-10 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
            Admin Panel
          </p>
          <h1 className="font-display text-5xl tracking-wider text-white">
            DASHBOARD
          </h1>
        </div>
        <Link
          to="/admin/members"
          className="border-border font-display hover:border-primary hover:text-primary border px-6 py-3 text-sm tracking-widest text-gray-400 transition-colors"
        >
          ALL MEMBERS →
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="bg-border mb-px grid grid-cols-2 gap-px lg:grid-cols-4">
        <StatCard
          label="Total Members"
          value={stats?.totalMembers ?? 0}
          sub="Registered accounts"
        />
        <StatCard
          label="Active Members"
          value={stats?.activeMembers ?? 0}
          sub="With active membership"
          accent
        />
        <StatCard
          label="New This Month"
          value={stats?.newMembersThisMonth ?? 0}
          sub="Last 30 days"
        />
        <StatCard
          label="Expired"
          value={stats?.expiredMembers ?? 0}
          sub="Need renewal"
        />
      </div>

      {/* Plan Breakdown + Recent Members */}
      <div className="bg-border mt-px grid grid-cols-1 gap-px lg:grid-cols-3">
        {/* Plan breakdown */}
        <div className="dash-section bg-surface p-8">
          <p className="font-display mb-6 text-xl tracking-widest text-white">
            PLAN BREAKDOWN
          </p>

          {stats?.planBreakdown?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {stats.planBreakdown.map(({ planName, count }) => {
                const total = stats.activeMembers || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={planName}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm tracking-widest text-gray-400 uppercase">
                        {planName || "Unknown"}
                      </span>
                      <span className="font-display text-sm text-white">
                        {count} <span className="text-gray-600">({pct}%)</span>
                      </span>
                    </div>
                    <div className="bg-border h-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No active memberships yet.</p>
          )}

          {/* No membership count */}
          <div className="border-border mt-8 border-t pt-6">
            <div className="flex justify-between">
              <span className="text-xs tracking-widest text-gray-500 uppercase">
                No Plan
              </span>
              <span className="font-display text-sm text-gray-400">
                {stats?.noMembership ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent members */}
        <div className="dash-section bg-surface p-8 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-xl tracking-widest text-white">
              RECENT MEMBERS
            </p>
            <Link
              to="/admin/members"
              className="text-primary text-xs tracking-widest uppercase hover:underline"
            >
              View all
            </Link>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-gray-600">No members yet.</p>
          ) : (
            <div className="divide-border flex flex-col divide-y">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="bg-primary/10 border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center border">
                      <span className="font-display text-primary text-sm">
                        {member.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-white">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`font-display px-3 py-1 text-xs tracking-widest ${
                        member.membershipStatus === "active"
                          ? "bg-primary/10 text-primary"
                          : member.membershipStatus === "expired"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {member.membershipStatus?.toUpperCase()}
                    </span>
                    <span className="hidden text-xs text-gray-600 sm:block">
                      {new Date(member.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="dash-section bg-border mt-px grid grid-cols-1 gap-px sm:grid-cols-2">
        <Link
          to="/admin/members"
          className="bg-surface group hover:bg-primary/5 flex items-center justify-between p-6 transition-colors"
        >
          <div>
            <p className="font-display group-hover:text-primary text-lg tracking-widest text-white transition-colors">
              MANAGE MEMBERS
            </p>
            <p className="mt-1 text-xs text-gray-500">
              View, update, assign memberships
            </p>
          </div>
          <span className="group-hover:text-primary text-2xl text-gray-600 transition-colors">
            →
          </span>
        </Link>

        <Link
          to="/membership"
          className="bg-surface group hover:bg-primary/5 flex items-center justify-between p-6 transition-colors"
        >
          <div>
            <p className="font-display group-hover:text-primary text-lg tracking-widest text-white transition-colors">
              MEMBERSHIP PLANS
            </p>
            <p className="mt-1 text-xs text-gray-500">View all active plans</p>
          </div>
          <span className="group-hover:text-primary text-2xl text-gray-600 transition-colors">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
