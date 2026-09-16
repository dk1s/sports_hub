import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fabric } from 'fabric'
import toast from 'react-hot-toast'
import { FaImage, FaFont, FaTrash, FaPlus, FaLayerGroup, FaArrowsAlt } from 'react-icons/fa'
import { useCart } from '../context/AppContext'
import { inr } from '../utils/format'

/* ---------- garment template paths ---------- */
export const garmentPaths = {
  front:
    'M250 56 L168 44 L112 82 L120 148 L170 140 L170 442 L330 442 L330 140 L380 148 L388 82 L332 44 Z',
  back:
    'M250 38 L160 46 L112 84 L388 84 L340 46 Z ' +
    'M112 84 L120 148 L168 140 L168 442 L332 442 L332 140 L380 148 L388 84 Z',
}

export const garmentTypes = [
  { id: 'Round-Neck T-Shirt', label: 'Round-Neck T-Shirt', price: 449, fabric: 'Combed Cotton 180 GSM' },
  { id: 'Polo T-Shirt', label: 'Polo T-Shirt', price: 599, fabric: 'Pique Cotton' },
  { id: 'Team Jersey (Sublimated)', label: 'Team Jersey (Sublimated)', price: 649, fabric: 'Sublimation Mesh' },
  { id: 'Pro Player Jersey', label: 'Pro Player Jersey', price: 799, fabric: 'Dry-Fit Micro Mesh' },
]

export const shirtColors = [
  '#FFFFFF', '#0E4637', '#08251F', '#FF6B2C', '#C93C07', '#D9F044',
  '#1E3A8A', '#111827', '#E11D48', '#7C3AED', '#0EA5E9', '#F1F5F9', '#94A3B8',
]

const fonts = ['Arial', 'Verdana', 'Georgia', 'Impact', "'Courier New'", "'Times New Roman'", 'Trebuchet MS']

const palettes = ['#101828', '#FFFFFF', '#FF6B2C', '#D9F044', '#1E805F', '#E11D48', '#1E3A8A']

const templateId = '__template__'

let canvasInstances = new WeakMap()

export default function Designer() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const storeRef = useRef({ front: [], back: [], price: garmentTypes[2].price, garment: garmentTypes[2] })
  const [view, setView] = useState('front')
  const viewRef = useRef('front')
  const [base, setBase] = useState('#0E4637')
  const baseRef = useRef('#0E4637')
  const [garment, setGarment] = useState(garmentTypes[2])
  const garmentRef = useRef(garmentTypes[2])
  const [font, setFont] = useState('Arial')
  const [fontSize, setFontSize] = useState(44)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('L')
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  const { add } = useCart()
  const fileRef = useRef(null)
  const renderCanvasRef = useRef(null)

  /* ---- render template + objects for a given view/base ---- */
  const renderScene = useCallback((objects, v, color) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = '#F3F4F1'
    const path = new fabric.Path(garmentPaths[v], {
      left: 0, top: 0, width: 500, height: 500,
      fill: color,
      stroke: 'rgba(16,24,40,.18)',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: false,
    })
    ;(path).name = templateId
    canvas.add(path)
    objects.forEach((o) => {
      if (o.type === 'text') {
        const t = new fabric.Text(o.text, {
          left: o.left, top: o.top, fontSize: o.fontSize,
          fill: o.fill, fontFamily: o.fontFamily,
          fontWeight: o.bold ? '800' : '400',
          angle: o.angle || 0, scaleX: o.scaleX || 1, scaleY: o.scaleY || 1,
          charSpacing: o.charSpacing || 0,
        })
        canvas.add(t)
      } else if (o.type === 'logo' && o.src) {
        fabric.Image.fromURL(
          o.src,
          (img) => {
            img.set({
              left: o.left, top: o.top,
              scaleX: o.scaleX, scaleY: o.scaleY,
              angle: o.angle || 0,
              flipX: o.flipX || false,
              flipY: o.flipY || false,
            })
            canvas.add(img)
            canvas.renderAll()
          },
          { crossOrigin: 'anonymous' },
        )
      }
    })
    canvas.renderAll()
  }, [])

  /* ---- collect objects for current view (excluding template) ---- */
  const collectObjects = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return []
    return canvas.getObjects().filter((o) => o.name !== templateId).map((o) => {
      if (o.type === 'text') {
        return {
          type: 'text', text: o.text, left: o.left, top: o.top, fontSize: o.fontSize,
          fill: o.fill, fontFamily: o.fontFamily, bold: o.fontWeight === '800',
          angle: o.angle, scaleX: o.scaleX, scaleY: o.scaleY, charSpacing: o.charSpacing,
        }
      }
      if (o.type === 'image') {
        return { type: 'logo', src: o.getSrc(), left: o.left, top: o.top, scaleX: o.scaleX, scaleY: o.scaleY, angle: o.angle, flipX: o.flipX, flipY: o.flipY }
      }
      return null
    }).filter(Boolean)
  }, [])

  /* ---- create canvas ---- */
  useEffect(() => {
    if (!containerRef.current || canvasRef.current) return
    const el = document.createElement('canvas')
    el.width = 500
    el.height = 500
    containerRef.current.appendChild(el)
    const canvas = new fabric.Canvas(el, {
      width: 500, height: 500, backgroundColor: '#F3F4F1',
      selection: false,
      preserveObjectStacking: true,
    })
    canvasRef.current = canvas
    renderScene([], 'front', baseRef.current)
    return () => {
      canvas.dispose()
      canvasRef.current = null
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetCanvas = useCallback(() => {
    renderScene(storeRef.current[viewRef.current], viewRef.current, baseRef.current)
  }, [renderScene])

  /* ---- switch view ---- */
  const switchView = useCallback(
    (v) => {
      storeRef.current[viewRef.current] = collectObjects()
      viewRef.current = v
      setView(v)
      renderScene(storeRef.current[v], v, baseRef.current)
      toast(`Showing ${v} side`, { icon: v === 'front' ? '👕' : '🔙' })
    },
    [collectObjects, renderScene],
  )

  /* ---- base color change ---- */
  const changeBase = useCallback(
    (c) => {
      baseRef.current = c
      setBase(c)
      renderScene(storeRef.current[viewRef.current], viewRef.current, c)
    },
    [renderScene],
  )

  /* ---- garment change ---- */
  const changeGarment = useCallback(
    (g) => {
      garmentRef.current = g
      setGarment(g)
    },
    [],
  )

  /* ---- text ops ---- */
  const addText = useCallback(
    (text, top, fontSize, bold = false, charSpacing = 0) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const t = new fabric.Text(text, {
        left: 145, top,
        fontSize, fill: textColor,
        fontFamily: font,
        fontWeight: bold ? '800' : '400',
        charSpacing,
        cornerSize: 10,
      })
      canvas.add(t)
      canvas.setActiveObject(t)
      canvas.renderAll()
    },
    [font, textColor],
  )

  const applySelectionStyle = useCallback(
    (key) => {
      const canvas = canvasRef.current
      const active = canvas?.getActiveObject()
      if (!active || active.type !== 'text') return
      if (key === 'font') active.set('fontFamily', font)
      if (key === 'size') active.set('fontSize', Number(fontSize))
      if (key === 'color') active.set('fill', textColor)
      canvas.renderAll()
    },
    [font, fontSize, textColor],
  )

  /* ---- upload logo ---- */
  const onLogo = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.')
      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result
        fabric.Image.fromURL(
          src,
          (img) => {
            const max = 140
            const scale = Math.min(max / img.width, 1)
            img.set({
              left: 250 - (img.width * scale) / 2,
              top: 200 - (img.height * scale) / 2,
              scaleX: scale, scaleY: scale,
              cornerSize: 12,
            })
            canvasRef.current?.add(img)
            canvasRef.current?.setActiveObject(img)
            canvasRef.current?.renderAll()
            toast.success('Logo added — drag, resize & rotate it')
          },
          { crossOrigin: 'anonymous' },
        )
      }
      reader.readAsDataURL(file)
    },
    [],
  )

  const deleteActive = useCallback(() => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return toast('Select a design element first', { icon: '🎯' })
    canvas.remove(active)
    canvas.discardActiveObject()
    canvas.renderAll()
  }, [])

  /* ---- save + add to cart ---- */
  const saveAndAdd = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.getObjects().length === 1) return toast.error('Add a name, number or logo to your design first.')
    storeRef.current[viewRef.current] = collectObjects()
    setSaving(true)
    setTimeout(() => {
      try {
        // export current view as the preview
        const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1.2 })
        const g = garmentRef.current
        const design = {
          kind: 'custom',
          name: `${g.label} · ${size}`,
          price: g.price,
          qty,
          size,
          baseColor: baseRef.current,
          view,
          design: { ...storeRef.current },
          preview: dataUrl,
        }
        add(undefined, { size, custom: design })
        setAdded(true)
        toast.success('Design added to cart')
      } catch (err) {
        toast.error('Could not save the design: ' + err.message)
      } finally {
        setSaving(false)
      }
    }, 350)
  }, [add, collectObjects, qty, size])

  /* keep garment in store */
  useEffect(() => {
    storeRef.current.garment = garment
  }, [garment])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Canvas + toolbar */}
      <div>
        <div className="card p-4">
          {/* top toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-full border border-ink/10 p-1">
              {['front', 'back'].map((v) => (
                <button
                  key={v}
                  onClick={() => switchView(v)}
                  className={`rounded-full px-5 py-2 text-sm font-bold capitalize transition ${view === v ? 'bg-brand-700 text-white' : 'text-ink/60 hover:text-ink'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
              <button onClick={() => fileRef.current?.click()} className="btn-outline px-4 py-2 text-xs">
                <FaImage /> Upload logo
              </button>
              <button onClick={deleteActive} className="btn-outline px-4 py-2 text-xs text-red-600">
                <FaTrash /> Delete
              </button>
              <button onClick={resetCanvas} className="btn-outline px-4 py-2 text-xs">
                Reset
              </button>
            </div>
          </div>

          {/* canvas area */}
          <div className="relative overflow-hidden rounded-2xl bg-[#F3F4F1] ring-1 ring-ink/10">
            <div
              ref={containerRef}
              className="mx-auto w-full max-w-[500px]"
            />
            <p className="pointer-events-none absolute bottom-3 right-4 hidden items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold text-ink/50 backdrop-blur sm:flex">
              <FaArrowsAlt /> Drag to move · corners to resize/rotate
            </p>
          </div>

          {/* quick add text */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button onClick={() => addText('YOUR NAME', 205, 34)} className="btn-dark py-2.5 text-sm"><FaFont /> Add Name Text</button>
            <button onClick={() => addText('07', 300, 96, false)} className="btn-dark py-2.5 text-sm"><span className="font-display text-base font-black leading-none">07</span> Add Number</button>
          </div>
        </div>

        {/* size + qty + price summary */}
        <div className="card mt-6 p-5">
          <h3 className="font-display font-bold text-brand-900">Configure & order</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${size === s ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink/15 text-ink/70'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((n) => (
                  <button key={n} onClick={() => setQty(n)} className={`h-10 w-12 rounded-lg border text-sm font-bold ${qty === n ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink/15 text-ink/70'}`}>
                    {n}
                  </button>
                ))}
                <input
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                  className="h-10 w-14 rounded-lg border border-ink/15 text-center text-sm font-bold"
                />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-ink/50">Unit price</p>
              <p className="font-display text-2xl font-bold text-brand-900">{inr(garment.price)}</p>
              <p className="text-xs text-ink/50">+ {inr(garment.price * qty)} total · bulk discounts for 10+</p>
            </div>
          </div>
          <button
            onClick={saveAndAdd}
            disabled={saving || added}
            className="btn-primary mt-5 w-full py-3 text-sm"
          >
            {added ? 'Added to cart ✓' : saving ? 'Saving design…' : `Add Custom ${garment.label} to Cart — ${inr(garment.price)}`}
          </button>
          {added && (
            <p className="mt-3 text-center text-sm font-semibold text-emerald-600">
              <Link to="/cart" className="underline">Your design is in the cart</Link> — add one more or check out.
            </p>
          )}
        </div>
      </div>

      {/* Controls sidebar */}
      <div className="space-y-6">
        <div className="card p-5">
          <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-brand-900"><FaLayerGroup /> Garment Type</h4>
          <div className="space-y-1.5">
            {garmentTypes.map((g) => (
              <label key={g.id} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition ${garment.id === g.id ? 'border-brand-600 bg-brand-50' : 'border-ink/10 hover:border-ink/20'}`}>
                <input type="radio" checked={garment.id === g.id} onChange={() => changeGarment(g)} className="h-4 w-4 accent-accent" />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">{g.label}</span>
                  <span className="block text-xs text-ink/50">{g.fabric}</span>
                </span>
                <span className="font-display text-sm font-bold text-brand-700">{inr(g.price)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h4 className="mb-3 font-display text-sm font-bold text-brand-900">Base Colour</h4>
          <div className="grid grid-cols-7 gap-2">
            {shirtColors.map((c) => (
              <button
                key={c}
                onClick={() => changeBase(c)}
                style={{ background: c }}
                className={`aspect-square rounded-lg ring-2 ring-offset-1 transition ${base === c ? 'ring-accent' : 'ring-transparent hover:ring-ink/20'} ${c === '#FFFFFF' || c === '#F1F5F9' ? 'border border-ink/10' : ''}`}
                aria-label={`Colour ${c}`}
              />
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between text-xs text-ink/50">
            Custom colour
            <input type="color" value={base} onChange={(e) => changeBase(e.target.value)} className="ml-2 h-8 w-14 cursor-pointer rounded border border-ink/10" />
          </label>
        </div>

        <div className="card p-5">
          <h4 className="mb-3 font-display text-sm font-bold text-brand-900">Text Style</h4>
          <div className="space-y-4">
            <div>
              <label className="field-label">Font</label>
              <select value={font} onChange={(e) => { setFont(e.target.value); applySelectionStyle('font') }} className="field">
                {fonts.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f.replace(/'/g, '')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label text-xs font-medium">Size — <span className="font-bold tabular-nums">{fontSize}px</span></label>
              <input type="range" min="14" max="140" value={fontSize} onChange={(e) => { setFontSize(Number(e.target.value)); applySelectionStyle('size') }} className="w-full accent-accent" />
            </div>
            <div>
              <label className="field-label ">Colour</label>
              <div className="flex flex-wrap gap-2">
                {palettes.map((c) => (
                  <button key={c} onClick={() => { setTextColor(c); applySelectionStyle('color') }} style={{ background: c }} className={`h-7 w-7 rounded-full ring-2 ${textColor === c ? 'ring-accent' : 'ring-transparent'} ${c === '#FFFFFF' ? 'border border-ink/10' : ''}`} aria-label={`Text ${c}`} />
                ))}
                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); applySelectionStyle('color') }} className="h-7 w-9 cursor-pointer rounded border border-ink/10" />
              </div>
            </div>
            <button onClick={() => addText('Team Name', 130, 30)} className="btn-outline w-full py-2 text-xs">
              <FaPlus /> Add Team Name
            </button>
            <p className="text-[11px] leading-relaxed text-ink/50">
              Tip: select a text on the shirt, then tweak font/size/colour — it updates live.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}