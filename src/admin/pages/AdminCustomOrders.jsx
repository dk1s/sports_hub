import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaTshirt, FaEye, FaStickyNote, FaUserAlt, FaRedoAlt } from 'react-icons/fa'
import { customStatusFlow } from '../../services/api'
import { useGetCustomAllQuery, useSetCustomStatusMutation, useSetCustomNotesMutation } from '../../services/apiSlice'
import { ErrorState } from '../../components/ui/Async'
import { StatusBadge } from '../../components/ui/misc'
import { formatDate, cn } from '../../utils/format'

export default function AdminCustomOrders() {
  const [filter, setFilter] = useState('All')
  const [detail, setDetail] = useState(null)
  const [notes, setNotes] = useState('')
  const [notesSel, setNotesSel] = useState(null)
  const [savingNotes, setSavingNotes] = useState(false)
  const [busyStatus, setBusyStatus] = useState(null)

  const { data: orders = [], isLoading, isError, refetch } = useGetCustomAllQuery()
  const [setCustomStatus] = useSetCustomStatusMutation()
  const [setCustomNotes] = useSetCustomNotesMutation()

  const counts = orders.reduce((a, o) => { a[o.status] = (a[o.status] || 0) + 1; return a }, {})
  const tabs = [{ s: 'All', n: orders.length }, ...customStatusFlow.map((s) => ({ s, n: counts[s] || 0 }))]
  const list = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  const setStatus = async (id, status) => {
    setBusyStatus(id)
    try {
      await setCustomStatus({ id, status }).unwrap()
      if (detail?._id === id) setDetail((d) => (d ? { ...d, status } : d))
      toast.success(`Status → ${status}`)
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setBusyStatus(null)
    }
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      await setCustomNotes({ id: notesSel, notes }).unwrap()
      if (detail?._id === notesSel) setDetail((d) => (d ? { ...d, adminNotes: notes } : d))
      setNotesSel(null)
      toast.success('Note saved')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Custom Studio</p>
        <h1 className="font-display text-2xl font-bold text-brand-900">Custom T-Shirt Orders</h1>
        <p className="text-sm text-ink/50">{orders.length} total · review each request and update its status.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.s}
            onClick={() => setFilter(t.s)}
            className={cn('chip rounded-full px-4 py-2 text-xs font-bold transition', filter === t.s ? 'bg-violet-600 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink')}
          >
            {t.s} <span className="ml-1 rounded-full bg-white/20 px-1.5">{t.n}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}
        </div>
      ) : isError ? (
        <ErrorState title="Could not load custom orders" onRetry={refetch} />
      ) : orders.length === 0 ? (
            <div className="card px-6 py-16 text-center">
              <FaTshirt className="mx-auto mb-3 text-ink/20" size={30} />
              <p className="font-display font-bold text-brand-900">No custom orders yet</p>
              <p className="mt-1 text-sm text-ink/50">Designs submitted from the Custom Studio will appear here.</p>
            </div>
          ) : list.length === 0 ? (
            <div className="card px-6 py-14 text-center text-sm text-ink/50">No {filter} custom orders.</div>
          ) : (
            <div className="space-y-4">
              {list.map((o) => (
                <div key={o._id} className="card overflow-hidden">
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink/10">
                      {o.preview ? <img src={o.preview} alt={o.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-brand-50 text-brand-300"><FaTshirt size={26} /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-bold text-brand-900">{o.name}</h3>
                        <span className="chip bg-white text-ink/50 ring-1 ring-ink/10">#{o.no}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink/60">
                        <FaUserAlt className="mr-1 inline text-ink/30" />
                        {o.qty} pcs · {o.garment?.type} · {o.design?.baseColor}
                        {o.playerName || o.design?.text ? ` · Text: “${o.playerName || o.design.text}”` : ''}
                        {o.design?.number ? ` · No. ${o.design.number}` : ''}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/40">{formatDate(o.created)} · Est. ₹{o.price * o.qty} {o.logo && `· Logo included`}</p>
                      {o.specialNotes && <p className="mt-1.5 text-xs text-amber-700 line-clamp-1">💬 {o.specialNotes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={o.status} />
                      <button onClick={() => setDetail(detail?._id === o._id ? null : o)} className="btn-outline px-4 py-1.5 text-xs"><FaEye /> {detail?._id === o._id ? 'Hide' : 'Review'}</button>
                    </div>
                  </div>

                  {detail?._id === o._id && (
                    <div className="border-t border-ink/8 bg-violet-50/30 p-5">
                      <div className="grid gap-5 lg:grid-cols-3">
                        <div className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Garment</p>
                          <p className="mt-2 text-sm">{o.garment?.type}<br /><span className="text-xs text-ink/50">Sizes: {(o.garment?.size || []).join(', ')}</span></p>
                          <p className="mt-2 text-xs text-ink/50">Fabric: {o.design?.fabric || '—'}</p>
                          {o.sizeChart && <p className="mt-2 text-xs text-ink/50">Size chart: {o.sizeChart}</p>}
                        </div>
                        <div className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Design</p>
                          <p className="mt-2 text-sm text-ink/80">
                            Base: <span className="font-semibold">{o.design?.baseColor}</span> · Text: <b>{o.design?.text}</b> · No: <b>{o.design?.number}</b>
                          </p>
                          {o.design?.team && <p className="text-sm text-ink/70">Team: {o.design.team}</p>}
                          {o.logo ? (
                            <p className="mt-2 text-xs font-semibold text-emerald-700">✓ Logo attached — {o.logo.name || 'file uploaded'}</p>
                          ) : <p className="mt-2 text-xs text-ink/40">No logo provided.</p>}
                        </div>
                        <div className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Customer notes</p>
                          <p className="mt-2 text-sm text-ink/70">{o.specialNotes || 'No special instructions.'}</p>
                        </div>
                      </div>

                      {/* status stepper */}
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Update status:</span>
                        {customStatusFlow.map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(o._id, s)}
                            disabled={s === o.status || busyStatus === o._id}
                            className={cn(
                              'rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50',
                              s === o.status ? 'bg-violet-600 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/15 hover:bg-violet-50',
                            )}
                          >
                            {s === o.status ? `✓ ${s}` : s}
                          </button>
                        ))}
                      </div>

                      {/* admin notes */}
                      <div className="mt-5">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/40"><FaStickyNote className="text-violet-500" /> Admin note</p>
                        {notesSel === o._id ? (
                          <div className="flex gap-2">
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" className="w-full field" placeholder="e.g. Sponsor logo pending — asked captain on WhatsApp" />
                            <div className="flex shrink-0 flex-col gap-2">
                              <button onClick={saveNotes} disabled={savingNotes} className="btn-primary px-4 py-1.5 text-xs">{savingNotes ? '…' : 'Save'}</button>
                              <button onClick={() => setNotesSel(null)} className="btn-ghost px-4 py-1.5 text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-2.5 ring-1 ring-ink/10">
                            <p className="text-sm text-ink/70">{o.adminNotes || 'No note yet.'}</p>
                            <button onClick={() => { setNotesSel(o._id); setNotes(o.adminNotes || '') }} className="text-xs font-bold text-accent-600 hover:underline">{o.adminNotes ? 'Edit' : 'Add note'}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
      }

      <div className="mt-4 flex justify-end">
        <button onClick={refetch} className="btn-outline py-2 text-xs"><FaRedoAlt /> Refresh</button>
      </div>
    </div>
  )
}