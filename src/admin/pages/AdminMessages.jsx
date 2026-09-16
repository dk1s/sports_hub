import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEnvelopeOpen, FaEnvelope, FaCheckCircle, FaTrash, FaWhatsapp, FaReply, FaCircle, FaRedoAlt } from 'react-icons/fa'
import { useGetMessagesQuery, useSetMessageStatusMutation, useDeleteMessageMutation } from '../../services/apiSlice'
import { ErrorState } from '../../components/ui/Async'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { timeAgo, cn } from '../../utils/format'
import { useSettingsStore } from '../../context/AppContext'

export default function AdminMessages() {
  const [filter, setFilter] = useState('All')
  const confirm = useConfirm()
  const { settings } = useSettingsStore()

  const { data: messages = [], isLoading, isError, refetch } = useGetMessagesQuery()
  const [setMessageStatus] = useSetMessageStatusMutation()
  const [deleteMessage] = useDeleteMessageMutation()

  const counts = {
    All: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    read: messages.filter((m) => m.status === 'read').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
  }
  const unread = counts.new
  const list = filter === 'All' ? messages : messages.filter((m) => m.status === filter)

  const setStatus = async (id, status) => {
    try {
      await setMessageStatus({ id, status }).unwrap()
      toast.success(`Marked ${status}`)
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    }
  }

  const remove = async (id) => {
    const ok = await confirm({
      title: 'Delete this message?',
      message: 'The contact message will be permanently removed from the inbox.',
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteMessage({ id }).unwrap()
      toast.success('Message deleted')
    } catch (e) {
      toast.error(e?.data?.message || e?.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Contact Messages</h1>
          <p className="text-sm text-ink/50">Messages from the public Contact form.</p>
        </div>
        <button onClick={refetch} className="btn-outline py-2 text-xs"><FaRedoAlt /> Refresh</button>
      </div>

      <div className="mb-5 flex gap-2">
        {Object.entries(counts).map(([f, n]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn('chip rounded-full px-4 py-2 text-xs font-bold capitalize transition', filter === f ? 'bg-brand-700 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink')}
          >
            {f === 'All' ? 'All' : f} <span className="ml-1 rounded-full bg-white/20 px-1.5">{n}</span>
          </button>
        ))}
      </div>

      {unread > 0 && filter === 'All' && (
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-600"><FaCircle className="text-[8px]" /> {unread} unread message{unread > 1 ? 's' : ''}</p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}
        </div>
      ) : isError ? (
        <ErrorState title="Could not load messages" onRetry={refetch} />
      ) : messages.length === 0 ? (
            <div className="card px-6 py-16 text-center">
              <FaEnvelopeOpen className="mx-auto mb-3 text-ink/20" size={30} />
              <p className="font-display font-bold text-brand-900">Inbox is empty</p>
              <p className="mt-1 text-sm text-ink/50">Messages from the Contact page will appear here.</p>
            </div>
          ) : list.length === 0 ? (
            <div className="card px-6 py-14 text-center text-sm text-ink/50">No messages marked {filter}.</div>
          ) : (
            <div className="space-y-4">
              {list.map((m) => (
                <div key={m._id} className={cn('card overflow-hidden', m.status === 'new' && 'ring-2 ring-accent/40')}>
                  <div className="flex flex-wrap items-start gap-4 p-5">
                    <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white', m.status === 'new' ? 'bg-accent' : 'bg-brand-700')}>
                      {m.status === 'new' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-bold text-brand-900">{m.name}</h3>
                        <span className="text-xs text-ink/40">· {m.email}</span>
                        {m.phone && <span className="text-xs text-ink/40">· {m.phone}</span>}
                        {m.status === 'new' && <span className="chip bg-accent text-white">New</span>}
                      </div>
                      <p className="text-xs text-ink/40">{timeAgo(m.created)}</p>
                      {m.subject && <p className="mt-1.5 text-sm font-semibold text-ink">{m.subject}</p>}
                      <p className="mt-0.5 max-w-2xl text-sm text-ink/70">{m.message}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.status !== 'read' && <button onClick={() => setStatus(m._id, 'read')} className="btn-outline px-3 py-1.5 text-xs">Mark read</button>}
                        {m.status !== 'resolved' && <button onClick={() => setStatus(m._id, 'resolved')} className="btn-dark px-3 py-1.5 text-xs"><FaCheckCircle /> Mark resolved</button>}
                        <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your message to Sports Hub')}`} className="btn-outline px-3 py-1.5 text-xs"><FaReply /> Reply on email</a>
                        <a href={`https://wa.me/${m.phone ? m.phone.replace(/\D/g, '') : settings?.whatsapp}?text=${encodeURIComponent('Hi ' + m.name + ', thanks for writing to Sports Hub, Purnea!')}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-3 py-1.5 text-xs text-emerald-600"><FaWhatsapp /> WhatsApp</a>
                        <button onClick={() => remove(m._id)} className="btn-outline px-3 py-1.5 text-xs text-red-500"><FaTrash /> Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </div>
  )
}