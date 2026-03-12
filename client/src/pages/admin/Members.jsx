import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-primary/10 text-primary',
    expired: 'bg-red-500/10 text-red-400',
    none: 'bg-gray-800 text-gray-500',
  };
  return (
    <span className={`text-xs font-display tracking-widest px-3 py-1 ${styles[status] || styles.none}`}>
      {status?.toUpperCase() || 'NONE'}
    </span>
  );
};

const AdminMembers = () => {
  const containerRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [deactivating, setDeactivating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, plansRes] = await Promise.all([
        api.get('/admin/members'),
        api.get('/memberships'),
      ]);
      setMembers(membersRes.data.members);
      setPlans(plansRes.data.memberships);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo('.members-table',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  const filtered = members.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      m.membershipStatus === filter;
    return matchSearch && matchFilter;
  });

  const handleAssignMembership = async () => {
    if (!selectedPlan) return toast.error('Select a plan first');
    setAssigning(true);
    try {
      await api.post(`/admin/members/${selectedMember._id}/assign-membership`, {
        membershipId: selectedPlan,
      });
      toast.success(`Plan assigned to ${selectedMember.name}`);
      setSelectedMember(null);
      setSelectedPlan('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
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
      toast.error('Failed to deactivate member');
    } finally {
      setDeactivating(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="page-header mb-10">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="font-display text-5xl text-white tracking-wider">MEMBERS</h1>
        <p className="text-gray-500 text-sm mt-2">{members.length} total members</p>
      </div>

      {/* Search + Filters */}
      <div className="members-table flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-surface border border-border px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-gray-600"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'expired', 'none'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-xs font-display tracking-widest uppercase transition-colors ${
                filter === f
                  ? 'bg-primary text-dark'
                  : 'border border-border text-gray-400 hover:border-primary hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal">
                Member
              </th>
              <th className="text-left px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal hidden sm:table-cell">
                Plan
              </th>
              <th className="text-left px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal">
                Status
              </th>
              <th className="text-left px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal hidden md:table-cell">
                Expiry
              </th>
              <th className="text-left px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal hidden md:table-cell">
                Joined
              </th>
              <th className="text-right px-3 sm:px-6 py-4 text-gray-500 text-xs uppercase tracking-widest font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-600 text-sm">
                  No members found.
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">

                  {/* Member info — always visible */}
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-primary text-xs">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{member.name}</p>
                        <p className="text-gray-600 text-xs">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                    <span className="text-gray-400 text-sm">
                      {member.membershipPlan?.name || '—'}
                    </span>
                  </td>

                  {/* Status — always visible */}
                  <td className="px-3 sm:px-6 py-4">
                    <StatusBadge status={member.membershipStatus} />
                  </td>

                  {/* Expiry — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs">
                      {member.membershipExpiry
                        ? new Date(member.membershipExpiry).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : '—'
                      }
                    </span>
                  </td>

                  {/* Joined — hidden on mobile */}
                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs">
                      {new Date(member.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </td>

                  {/* Actions — always visible, stacked on mobile */}
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedMember(member); setSelectedPlan(''); }}
                        className="text-xs font-display tracking-widest px-3 py-2 border border-border text-gray-400 hover:border-primary hover:text-primary transition-colors w-full sm:w-auto text-center"
                      >
                        ASSIGN
                      </button>
                      <button
                        onClick={() => handleDeactivate(member._id, member.name)}
                        disabled={deactivating === member._id || !member.isActive}
                        className="text-xs font-display tracking-widest px-3 py-2 border border-red-900 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto text-center"
                      >
                        {deactivating === member._id ? '...' : 'DEACTIVATE'}
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
      <p className="text-gray-600 text-xs mt-4">
        Showing {filtered.length} of {members.length} members
      </p>

      {/* Assign Membership Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md p-8">

            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Assign Plan</p>
                <h3 className="font-display text-2xl text-white tracking-wider">
                  {selectedMember.name.toUpperCase()}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{selectedMember.email}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-600 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {/* Current plan */}
            <div className="bg-dark border border-border p-4 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-white font-display tracking-widest">
                {selectedMember.membershipPlan?.name || 'None'}
              </p>
            </div>

            {/* Plan selector */}
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest">Select New Plan</p>
              {plans.map(plan => (
                <button
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan._id)}
                  className={`flex items-center justify-between p-4 border transition-colors ${
                    selectedPlan === plan._id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-gray-600'
                  }`}
                >
                  <span className={`font-display tracking-widest ${
                    selectedPlan === plan._id ? 'text-primary' : 'text-white'
                  }`}>
                    {plan.name.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">₹{plan.price}/mo</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 border border-border text-gray-400 font-display tracking-widest py-3 text-sm hover:border-gray-500 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleAssignMembership}
                disabled={!selectedPlan || assigning}
                className="flex-1 bg-primary text-dark font-display tracking-widest py-3 text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? 'ASSIGNING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;