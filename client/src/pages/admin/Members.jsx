import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import api from "../../utils/api";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-primary/10 text-primary",
    expired: "bg-red-500/10 text-red-400",
    none: "bg-gray-800 text-gray-500",
  };
  return (
    <span
      className={`font-display px-3 py-1 text-xs tracking-widest ${styles[status] || styles.none}`}
    >
      {status?.toUpperCase() || "NONE"}
    </span>
  );
};

const AdminMembers = () => {
  const containerRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [deactivating, setDeactivating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, plansRes] = await Promise.all([
        api.get("/admin/members"),
        api.get("/memberships"),
      ]);
      setMembers(membersRes.data.members);
      setPlans(plansRes.data.memberships);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        ".members-table",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.2 },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  // Filter + search
  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.membershipStatus === filter;
    return matchSearch && matchFilter;
  });

  const handleAssignMembership = async () => {
    if (!selectedPlan) return toast.error("Select a plan first");
    setAssigning(true);
    try {
      await api.post(`/admin/members/${selectedMember._id}/assign-membership`, {
        membershipId: selectedPlan,
      });
      toast.success(`Plan assigned to ${selectedMember.name}`);
      setSelectedMember(null);
      setSelectedPlan("");
      fetchData(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign plan");
    } finally {
      setAssigning(false);
    }
  };

  const handleDeactivate = async (memberId, memberName) => {
    if (!confirm(`Deactivate ${memberName}?`)) return;
    setDeactivating(memberId);
    try {
      await api.delete(`/admin/members/${memberId}`);
      toast.success(`${memberName} deactivated`);
      fetchData();
    } catch {
      toast.error("Failed to deactivate member");
    } finally {
      setDeactivating(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="page-header mb-10">
        <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
          Admin Panel
        </p>
        <h1 className="font-display text-5xl tracking-wider text-white">
          MEMBERS
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {members.length} total members
        </p>
      </div>

      {/* Search + Filters */}
      <div className="members-table mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface border-border focus:border-primary flex-1 border px-4 py-3 text-sm text-white transition-colors outline-none placeholder:text-gray-600"
        />
        <div className="flex gap-2">
          {["all", "active", "expired", "none"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-display px-4 py-3 text-xs tracking-widest uppercase transition-colors ${
                filter === f
                  ? "bg-primary text-dark"
                  : "border-border hover:border-primary hover:text-primary border text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border-border overflow-x-auto border">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                Member
              </th>
              <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                Plan
              </th>
              <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                Expiry
              </th>
              <th className="px-6 py-4 text-left text-xs font-normal tracking-widest text-gray-500 uppercase">
                Joined
              </th>
              <th className="px-6 py-4 text-right text-xs font-normal tracking-widest text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-gray-600"
                >
                  No members found.
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr
                  key={member._id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {/* Member info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 border-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center border">
                        <span className="font-display text-primary text-xs">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">
                      {member.membershipPlan?.name || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={member.membershipStatus} />
                  </td>

                  {/* Expiry */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {member.membershipExpiry
                        ? new Date(member.membershipExpiry).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setSelectedPlan("");
                        }}
                        className="font-display border-border hover:border-primary hover:text-primary border px-3 py-2 text-xs tracking-widest text-gray-400 transition-colors"
                      >
                        ASSIGN
                      </button>
                      <button
                        onClick={() =>
                          handleDeactivate(member._id, member.name)
                        }
                        disabled={
                          deactivating === member._id || !member.isActive
                        }
                        className="font-display border border-red-900 px-3 py-2 text-xs tracking-widest text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {deactivating === member._id ? "..." : "DEACTIVATE"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <p className="mt-4 text-xs text-gray-600">
        Showing {filtered.length} of {members.length} members
      </p>

      {/* Assign Membership Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-surface border-border w-full max-w-md border p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
                  Assign Plan
                </p>
                <h3 className="font-display text-2xl tracking-wider text-white">
                  {selectedMember.name.toUpperCase()}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedMember.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-xl text-gray-600 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Current plan */}
            <div className="bg-dark border-border mb-6 border p-4">
              <p className="mb-1 text-xs tracking-widest text-gray-500 uppercase">
                Current Plan
              </p>
              <p className="font-display tracking-widest text-white">
                {selectedMember.membershipPlan?.name || "None"}
              </p>
            </div>

            {/* Plan selector */}
            <div className="mb-6 flex flex-col gap-3">
              <p className="text-xs tracking-widest text-gray-500 uppercase">
                Select New Plan
              </p>
              {plans.map((plan) => (
                <button
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan._id)}
                  className={`flex items-center justify-between border p-4 transition-colors ${
                    selectedPlan === plan._id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-gray-600"
                  }`}
                >
                  <span
                    className={`font-display tracking-widest ${
                      selectedPlan === plan._id ? "text-primary" : "text-white"
                    }`}
                  >
                    {plan.name.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">
                    ₹{plan.price}/mo
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="border-border font-display flex-1 border py-3 text-sm tracking-widest text-gray-400 transition-colors hover:border-gray-500"
              >
                CANCEL
              </button>
              <button
                onClick={handleAssignMembership}
                disabled={!selectedPlan || assigning}
                className="bg-primary text-dark font-display flex-1 py-3 text-sm tracking-widest transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning ? "ASSIGNING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
