import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaPalette, FaClipboardList, FaBolt, FaCheck, FaShieldAlt } from 'react-icons/fa'
import Designer from './Designer'
import SimpleForm from './SimpleForm'
import { cn } from '../utils/format'

export default function Customize() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'form' ? 'form' : 'designer'

  return (
    <div className="container-x py-10">
      {/* header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 px-6 py-10 text-white sm:px-12">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative">
          <p className="eyebrow mb-2 text-accent">Custom T-Shirt & Jersey Studio</p>
          <h1 className="text-balance font-display text-4xl font-bold sm:text-5xl">
            Design it your way. <span className="bg-gradient-to-r from-accent to-amber-300 bg-clip-text text-transparent">We print it.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Two ways to get your team looking sharp: design live on the canvas below, or tell us exactly
            what you need in the simple form. Both land in your admin-tracked order queue in minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setParams({ tab: 'designer' })}
              className={cn('btn px-5 py-2.5 text-sm', tab === 'designer' ? 'bg-accent text-white hover:bg-accent-600' : 'border border-white/20 text-white hover:bg-white/10')}
            >
              <FaPalette /> Interactive Designer
            </button>
            <button
              onClick={() => setParams({ tab: 'form' })}
              className={cn('btn px-5 py-2.5 text-sm', tab === 'form' ? 'bg-accent text-white hover:bg-accent-600' : 'border border-white/20 text-white hover:bg-white/10')}
            >
              <FaClipboardList /> Simple Requirement Form
            </button>
          </div>
        </div>
      </div>

      {/* trust strip */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: <FaBolt />, t: 'Design approved in 24 hrs', d: 'We confirm artwork on WhatsApp' },
          { icon: <FaCheck />, t: '5–7 day turnaround', d: 'Rush delivery available on request' },
          { icon: <FaShieldAlt />, t: 'COD & bulk discounts', d: 'Teams of 10+ save extra' },
        ].map((x) => (
          <div key={x.t} className="card flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{x.icon}</span>
            <div>
              <p className="text-sm font-bold text-brand-900">{x.t}</p>
              <p className="text-xs text-ink/50">{x.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'designer' ? (
          <Designer />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className="eyebrow">No design skills? No problem.</p>
              <Link to="/customize" className="text-sm font-semibold text-accent-600 hover:underline">Try the interactive designer instead →</Link>
            </div>
            <SimpleForm />
          </>
        )}
      </div>
    </div>
  )
}