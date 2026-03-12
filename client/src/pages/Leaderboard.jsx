import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/api";
import { BADGES } from "../utils/badges";

gsap.registerPlugin(ScrollTrigger);

const RankIcon = ({ rank }) => {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="font-display text-xl text-gray-600">
      {String(rank).padStart(2, "0")}
    </span>
  );
};

const Leaderboard = () => {
  const containerRef = useRef(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/gamification/leaderboard");
        setLeaders(data.leaderboard);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lb-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".podium-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        },
      );
      gsap.fromTo(
        ".lb-row",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: ".lb-table", start: "top 80%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const top3 = leaders.slice(0, 3);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );

  return (
    <div ref={containerRef} className="bg-dark min-h-screen">
      {/* Header */}
      <div className="lb-header bg-surface border-border border-b px-8 pt-32 pb-12 lg:px-24">
        <div className="container-wide">
          <p className="section-label">Hall of Fame</p>
          <h1 className="font-display text-5xl leading-none text-white lg:text-7xl">
            LEADER
            <br />
            <span className="text-gray-600">BOARD.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm text-gray-400">
            Earn points by checking in daily. Build streaks, unlock badges, and
            <br />
            climb to the top.
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="section-padding">
          <div className="container-wide">
            <p className="section-label mb-8">Top Performers</p>

            {/* Reorder: 2nd, 1st, 3rd for podium effect */}
            <div className="bg-border grid grid-cols-1 gap-px md:grid-cols-3">
              {[top3[1], top3[0], top3[2]].map((member, i) => {
                if (!member) return <div key={i} className="bg-dark" />;
                const actualRank = i === 1 ? 1 : i === 0 ? 2 : 3;
                return (
                  <div
                    key={member._id}
                    className={`podium-card flex flex-col items-center p-8 text-center ${
                      actualRank === 1 ? "bg-primary" : "bg-surface"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`font-display mb-4 flex h-16 w-16 items-center justify-center text-2xl ${
                        actualRank === 1
                          ? "bg-dark text-primary"
                          : "bg-primary/10 border-primary/20 text-primary border"
                      }`}
                    >
                      {member.name?.charAt(0).toUpperCase()}
                    </div>

                    <RankIcon rank={actualRank} />

                    <p
                      className={`font-display mt-3 text-xl tracking-wider ${
                        actualRank === 1 ? "text-dark" : "text-white"
                      }`}
                    >
                      {member.name.toUpperCase()}
                    </p>

                    <p
                      className={`font-display mt-2 text-4xl ${
                        actualRank === 1 ? "text-dark" : "text-primary"
                      }`}
                    >
                      {member.points}
                      <span
                        className={`font-body ml-1 text-sm ${
                          actualRank === 1 ? "text-dark/60" : "text-gray-500"
                        }`}
                      >
                        pts
                      </span>
                    </p>

                    <div
                      className={`mt-4 flex gap-4 text-xs ${
                        actualRank === 1 ? "text-dark/60" : "text-gray-500"
                      }`}
                    >
                      <span>🔥 {member.streak} streak</span>
                      <span>· {member.totalCheckIns} check-ins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full leaderboard table */}
      {leaders.length > 0 && (
        <div className="lb-table section-padding bg-dark">
          <div className="container-wide">
            <p className="section-label mb-8">Full Rankings</p>

            <div className="bg-surface border-border overflow-hidden border">
              <table className="w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                      Member
                    </th>
                    <th className="hidden px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase sm:table-cell">
                      Badges
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                      Streak
                    </th>
                    <th className="hidden px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase md:table-cell">
                      Check-ins
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-normal tracking-widest text-gray-500 uppercase">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {leaders.map((member, index) => (
                    <tr
                      key={member._id}
                      className="lb-row transition-colors hover:bg-white/2"
                    >
                      <td className="px-6 py-4">
                        <RankIcon rank={index + 1} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center border">
                            <span className="font-display text-primary text-xs">
                              {member.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-white">{member.name}</p>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <div className="flex gap-1">
                          {member.badges?.slice(0, 3).map((b) => (
                            <span
                              key={b}
                              title={BADGES[b]?.label}
                              className="text-base"
                            >
                              {BADGES[b]?.icon}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          🔥 {member.streak}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <span className="text-sm text-gray-500">
                          {member.totalCheckIns}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-primary font-display text-xl">
                          {member.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {leaders.length === 0 && (
        <div className="section-padding">
          <div className="container-wide text-center">
            <p className="font-display mb-4 text-4xl text-gray-700">
              NO DATA YET
            </p>
            <p className="text-gray-600">
              Be the first to check in and top the leaderboard!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
