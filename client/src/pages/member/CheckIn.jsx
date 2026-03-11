import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { BADGES } from "../../utils/badges";

const StatBox = ({ label, value, accent }) => (
  <div className="bg-surface border-border flex flex-col gap-1 border p-6">
    <p className="text-xs tracking-widest text-gray-500 uppercase">{label}</p>
    <p
      className={`font-display text-5xl ${accent ? "text-primary" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);

const CheckInPage = () => {
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/gamification/my-stats");
      setStats(data.stats);
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".checkin-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stat-box",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".checkin-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.4 },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const { data } = await api.post("/gamification/checkin");

      // Punch animation on button
      gsap.to(btnRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => gsap.to(btnRef.current, { scale: 1 }),
      });

      toast.success(data.message, { duration: 4000 });

      // Show new badge toast
      if (data.newBadges?.length > 0) {
        data.newBadges.forEach((badge) => {
          const b = BADGES[badge];
          if (b)
            toast.success(`New badge unlocked: ${b.icon} ${b.label}!`, {
              duration: 5000,
            });
        });
      }

      fetchStats(); // refresh stats
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });
      const checked = stats?.recentCheckIns?.some((c) => c.date === dateStr);
      days.push({
        dateStr,
        checked,
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      });
    }
    return days;
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="checkin-header mb-10">
        <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
          Daily Activity
        </p>
        <h1 className="font-display text-5xl tracking-wider text-white">
          CHECK IN
        </h1>
      </div>

      {/* Stats row */}
      <div className="bg-border mb-px grid grid-cols-2 gap-px lg:grid-cols-4">
        <div className="stat-box">
          <StatBox label="Total Points" value={stats?.points ?? 0} accent />
        </div>
        <div className="stat-box">
          <StatBox label="Current Streak" value={`${stats?.streak ?? 0}🔥`} />
        </div>
        <div className="stat-box">
          <StatBox label="Longest Streak" value={stats?.longestStreak ?? 0} />
        </div>
        <div className="stat-box">
          <StatBox label="Total Check-ins" value={stats?.totalCheckIns ?? 0} />
        </div>
      </div>

      <div className="bg-border mt-px grid grid-cols-1 gap-px lg:grid-cols-2">
        {/* Check-in card */}
        <div className="checkin-card bg-surface flex flex-col items-center justify-center gap-6 p-8 text-center">
          {stats?.checkedInToday ? (
            <>
              <div className="bg-primary/10 border-primary flex h-24 w-24 items-center justify-center border-2">
                <span className="text-5xl">✅</span>
              </div>
              <div>
                <p className="font-display text-primary mb-1 text-2xl tracking-wider">
                  CHECKED IN
                </p>
                <p className="text-sm text-gray-500">
                  You're done for today. See you tomorrow!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>🔥 {stats.streak}-day streak</span>
                <span>·</span>
                <span>Come back tomorrow for +10 pts</span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-primary/5 border-border flex h-24 w-24 items-center justify-center border">
                <span className="text-5xl">💪</span>
              </div>
              <div>
                <p className="font-display mb-1 text-2xl tracking-wider text-white">
                  READY TO TRAIN?
                </p>
                <p className="text-sm text-gray-500">
                  Check in to earn points and keep your streak alive.
                </p>
              </div>
              <button
                ref={btnRef}
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="bg-primary text-dark font-display w-full py-5 text-xl tracking-widest transition-colors hover:bg-yellow-300 disabled:opacity-50"
              >
                {checkingIn ? "CHECKING IN..." : "⚡ CHECK IN NOW (+10 PTS)"}
              </button>
            </>
          )}
        </div>

        {/* Weekly activity heatmap */}
        <div className="checkin-card bg-surface p-8">
          <p className="font-display mb-6 text-xl tracking-widest text-white">
            THIS WEEK
          </p>

          <div className="mb-8 flex gap-2">
            {getLast7Days().map(({ dateStr, checked, label }) => (
              <div
                key={dateStr}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`flex aspect-square w-full items-center justify-center border ${
                    checked
                      ? "bg-primary border-primary"
                      : "bg-dark border-border"
                  }`}
                >
                  {checked && (
                    <span className="text-dark text-xs font-bold">✓</span>
                  )}
                </div>
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>

          {/* Recent check-ins */}
          <p className="font-display mb-4 text-sm tracking-widest text-gray-500 uppercase">
            Recent Activity
          </p>
          <div className="flex flex-col gap-2">
            {stats?.recentCheckIns?.length > 0 ? (
              stats.recentCheckIns.map((c) => (
                <div
                  key={c._id}
                  className="border-border flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    {c.bonusReason && (
                      <p className="text-primary text-xs">{c.bonusReason}</p>
                    )}
                  </div>
                  <span className="text-primary font-display text-lg">
                    +{c.pointsEarned}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No check-ins yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="checkin-card bg-surface border-border mt-px border p-8">
        <p className="font-display mb-6 text-xl tracking-widest text-white">
          YOUR BADGES
        </p>
        {stats?.badges?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {stats.badges.map((badge) => {
              const b = BADGES[badge];
              if (!b) return null;
              return (
                <div
                  key={badge}
                  className={`flex items-center gap-3 border px-4 py-3 ${b.bg} border-current ${b.color}`}
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p
                      className={`font-display text-sm tracking-widest ${b.color}`}
                    >
                      {b.label.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No badges yet — check in to earn your first one!
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;
