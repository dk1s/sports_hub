import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FaSearch, FaBan, FaCheckCircle, FaShieldAlt, FaUsers, FaRedoAlt } from 'react-icons/fa'
import { useGetUsersQuery, useToggleBlockUserMutation } from '../../services/apiSlice'
import { ErrorState } from '../../components/ui/Async'
import { StatusBadge } from '../../components/ui/misc'
import { formatDate, cn, initials } from '../../utils/format'

export default function AdminUsers() {
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(null)

  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery()
  const [toggleBlock] = useToggleBlockUserMutation()

  const filtered = useMemo(() => {
    if (!q.trim()) return users
    const t = q.toLowerCase()
    return users.filter((u) => [u.name, u.email, u._id].join(' ').toLowerCase().includes(t))
  }, [users, q])

  const toggle = async (u) => {
    setBusy(u._id)
    try {
      const next = await toggleBlock({ userId: u._id, block: !u.blocked }).unwrap()
      toast.success(next.blocked ? `${u.name} blocked` : `${u.name} unblocked`)
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Customers</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Users</h1>
          <p className="text-sm text-ink/50">{users.length} registered accounts.</p>
        </div>
        <button onClick={refetch} className="btn-outline py-2 text-xs"><FaRedoAlt /> Refresh</button>
      </div>

      <div className="card mb-5 flex items-center gap-2 p-4">
        <FaSearch className="text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="w-full bg-transparent text-sm focus:outline-none" />
      </div>

      {isLoading ? (
        <div className="card h-40 animate-pulse" />
      ) : isError ? (
        <ErrorState title="Could not load users" onRetry={refetch} />
      ) : users.length === 0 ? (
            <div className="card px-6 py-16 text-center">
              <FaUsers className="mx-auto mb-3 text-ink/20" size={30} />
              <p className="font-display font-bold text-brand-900">No users yet</p>
              <p className="mt-1 text-sm text-ink/50">Registered customers will appear here.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-950 text-left text-xs font-bold uppercase tracking-wider text-white/80">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Joined</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {filtered.map((u) => (
                      <tr key={u._id} className="hover:bg-brand-50/40">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                              {initials(u.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-ink">{u.name} {u.role === 'admin' && <FaShieldAlt className="ml-1 inline text-accent" />}</p>
                              <p className="text-xs text-ink/50">{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn('chip ring-1', u.role === 'admin' ? 'bg-accent text-white' : 'bg-brand-50 text-brand-700 ring-brand-100')}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-ink/50">{formatDate(u.createdAt)}</td>
                        <td className="px-5 py-3"><StatusBadge status={u.blocked ? 'Blocked' : 'Active'} /></td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => toggle(u)}
                            disabled={busy === u._id || u.role === 'admin'}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40',
                              u.blocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100',
                            )}
                            title={u.role === 'admin' ? 'Admins cannot be blocked' : u.blocked ? 'Allow access' : 'Block access'}
                          >
                            {u.blocked ? <><FaCheckCircle /> Unblock</> : <><FaBan /> Block</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="5" className="px-5 py-12 text-center text-ink/50">No users match “{q}”.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )
      }
    </div>
  )
}