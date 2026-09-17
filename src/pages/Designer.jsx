import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fabric } from 'fabric'
import toast from 'react-hot-toast'
import { FaImage, FaFont, FaTrash, FaPlus, FaLayerGroup, FaArrowsAlt, FaRobot, FaMagic, FaSpinner, FaEye } from 'react-icons/fa'
import { useCart } from '../context/AppContext'
import { inr } from '../utils/format'

/* ---------- product template paths (500×500 template) ---------- */
const tshirtFront = 'M250 56 L168 44 L112 82 L120 148 L170 140 L170 442 L330 442 L330 140 L380 148 L388 82 L332 44 Z'
const tshirtBack = 'M250 38 L160 46 L112 84 L388 84 L340 46 Z M112 84 L120 148 L168 140 L168 442 L332 442 L332 140 L380 148 L388 84 Z'

export const garmentTypes = [
  { id: 'Round-Neck T-Shirt', label: 'Round-Neck T-Shirt', price: 449, fabric: 'Combed Cotton 180 GSM', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Polo T-Shirt', label: 'Polo T-Shirt', price: 599, fabric: 'Pique Cotton', paths: { front: 'M250 46 L176 40 L116 78 L124 146 L170 138 L170 442 L330 442 L330 138 L376 146 L384 78 L324 40 Z', back: 'M250 30 L162 40 L116 82 L384 82 L338 40 Z M116 82 L124 146 L170 138 L170 442 L332 442 L332 138 L376 146 L384 82 Z' } },
  { id: 'Team Jersey (Sublimated)', label: 'Team Jersey (Sublimated)', price: 649, fabric: 'Sublimation Mesh', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Pro Player Jersey', label: 'Pro Player Jersey', price: 799, fabric: 'Dry-Fit Micro Mesh', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Track Lower', label: 'Track Lower', price: 599, fabric: 'Rapid-Dry Fabric', paths: { front: 'M250 74 C238 74 196 82 166 108 L144 168 L112 158 L92 436 L156 436 L184 300 C196 292 228 288 250 288 Z M250 74 C262 74 304 82 334 108 L356 168 L388 158 L408 436 L344 436 L316 300 C304 292 272 288 250 288 Z', back: 'M250 74 C238 74 196 82 166 108 L144 168 L112 158 L92 436 L156 436 L184 300 C196 292 228 288 250 288 Z M250 74 C262 74 304 82 334 108 L356 168 L388 158 L408 436 L344 436 L316 300 C304 292 272 288 250 288 Z' } },
  { id: 'Batting Gloves', label: 'Batting Gloves', price: 899, fabric: 'PP + Leather Palm', paths: { front: 'M168 108 C128 120 116 170 122 224 L116 300 C118 328 138 348 166 348 L208 342 L220 254 L228 176 C228 134 208 100 168 108 Z M332 108 C372 120 384 170 378 224 L384 300 C382 328 362 348 334 348 L292 342 L280 254 L272 176 C272 134 292 100 332 108 Z', back: 'M168 108 C128 120 116 170 122 224 L116 300 C118 328 138 348 166 348 L208 342 L220 254 L228 176 C228 134 208 100 168 108 Z M332 108 C372 120 384 170 378 224 L384 300 C382 328 362 348 334 348 L292 342 L280 254 L272 176 C272 134 292 100 332 108 Z' } },
  { id: 'Cricket Cap', label: 'Cricket Cap', price: 399, fabric: 'Polyester', paths: { front: 'M250 106 C176 106 136 154 128 220 L128 248 L372 248 L372 220 C364 154 324 106 250 106 Z M128 248 C110 254 98 270 102 292 C110 322 152 334 250 334 C348 334 390 322 398 292 C402 270 390 254 372 248 Z', back: 'M250 106 C176 106 136 154 128 220 L128 300 L372 300 L372 220 C364 154 324 106 250 106 Z M128 300 L128 344 L372 344 L372 300 Z' } },
  { id: 'Batting Helmet', label: 'Batting Helmet', price: 1499, fabric: 'ABS + Steel Grill', paths: { front: 'M250 96 C170 96 130 148 122 226 L122 256 L378 256 L378 226 C370 148 330 96 250 96 Z M122 210 L96 300 C92 332 118 352 150 342 L170 316 L180 238 Z M378 210 L404 300 C408 332 382 352 350 342 L330 316 L320 238 Z', back: 'M250 96 C170 96 130 148 122 226 L118 320 C116 356 250 386 250 386 C250 386 384 356 382 320 L378 226 C370 148 330 96 250 96 Z' } },
  { id: 'Cricket Bat', label: 'Cricket Bat', price: 1999, fabric: 'Grade-A Willow', paths: { front: 'M250 502 C304 502 310 496 310 468 L310 300 C310 210 300 180 286 162 L292 98 C292 80 278 66 250 66 C222 66 208 80 208 98 L214 162 C200 180 190 210 190 300 L190 468 C190 496 196 502 250 502 Z', back: 'M250 502 C304 502 310 496 310 468 L310 300 C310 210 300 180 286 162 L292 98 C292 80 278 66 250 66 C222 66 208 80 208 98 L214 162 C200 180 190 210 190 300 L190 468 C190 496 196 502 250 502 Z' } },
]

export const shirtColors = [
  '#FFFFFF', '#0E4637', '#08251F', '#FF6B2C', '#C93C07', '#D9F044',
  '#1E3A8A', '#111827', '#E11D48', '#7C3AED', '#0EA5E9', '#F1F5F9', '#94A3B8',
]

const fonts = ['Arial', 'Verdana', 'Georgia', 'Impact', "'Courier New'", "'Times New Roman'", 'Trebuchet MS']

const aiChips = ['Lion mascot', 'Eagle wings', 'Thunderbolt + lightning', 'Flame striker', 'Crown royal']

const fullIdeas = [
  { label: 'Eagle jersey', prompt: 'navy blue cricket jersey with a golden eagle chest print and white sleeves' },
  { label: 'Lion football kit', prompt: 'red and black football kit with a roaring lion crest on the chest' },
  { label: 'Thunder basketball', prompt: 'neon green basketball jersey with a yellow thunderbolt and big number' },
  { label: 'Crown polo', prompt: 'white and gold polo with a minimal crown logo on the chest' },
  { label: 'Flame cricket kit', prompt: 'black cricket kit with orange flame graphics and a dragon emblem' },
  { label: 'Tiger lower', prompt: 'royal blue track lower with white side stripes and a tiger logo' },
]

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
  const [scale, setScale] = useState(1)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiTab, setAiTab] = useState('art')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiImg, setAiImg] = useState('')
  const [aiErr, setAiErr] = useState('')
  const [fullPrompt, setFullPrompt] = useState('')
  const [fullGenBusy, setFullGenBusy] = useState(false)
  const [fullGenImages, setFullGenImages] = useState({ front: null, back: null, side: null })
  const [fullGenErr, setFullGenErr] = useState('')
  const [fullGenView, setFullGenView] = useState('front')
  const { add } = useCart()
  const fileRef = useRef(null)
  const renderCanvasRef = useRef(null)

  /* ---- render template + objects for a given view/base ---- */
  const renderScene = useCallback((objects, v, color) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = '#F3F4F1'
    const path = new fabric.Path(garmentRef.current.paths[v] || garmentRef.current.paths.front, {
      left: 0, top: 0, width: 500, height: 500,
      fill: color,
      stroke: 'rgba(16,24,40,.18)',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: false,
    })
    const pb = path.getBoundingRect()
    path.set({ left: 250 - pb.width / 2, top: 250 - pb.height / 2 })
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

    /* keep the fixed 500×500 canvas square and shrink it to fit narrow screens */
    let ro
    const measure = () => {
      const w = containerRef.current?.getBoundingClientRect().width || 500
      setScale(Math.min(1, w / 500))
    }
    ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    measure()

    return () => {
      ro?.disconnect()
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

  /* ---- garment/product change ---- */
  const changeGarment = useCallback(
    (g) => {
      garmentRef.current = g
      setGarment(g)
      storeRef.current.price = g.price
      renderScene(storeRef.current[viewRef.current], viewRef.current, baseRef.current)
    },
    [renderScene],
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

  /* ---- AI design generator (free Pollinations API — no key, no limits) ---- */
  const generateAi = async () => {
    const p = aiPrompt.trim()
    if (!p) return toast.error('Describe the design you want, e.g. “golden lion mascot”.')
    setAiBusy(true)
    setAiErr('')
    setAiImg('')
    try {
      const prompt = `${p}, flat vector sports team emblem logo, bold shapes, high contrast, solid white background, clean, professional`
      const base = window.location.protocol === 'https:' ? 'https://image.pollinations.ai' : '/ai-img'
      const url = `${base}/prompt/${encodeURIComponent(prompt)}?width=768&height=768&seed=${Math.floor(Math.random() * 999999)}&nologo=true`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`AI service replied ${res.status}`)
      const blob = await res.blob()
      const src = await new Promise((resolve) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = () => resolve('')
        r.readAsDataURL(blob)
      })
      if (!src) throw new Error('Could not read the AI image.')
      setAiImg(src)
      toast.success('AI design ready — pick Front, Back or Both to apply it')
    } catch (err) {
      console.error(err)
      setAiErr(err.message || 'Could not reach the free AI service. Please try again.')
    } finally {
      setAiBusy(false)
    }
  }

  const applyAiTo = useCallback(
    (target) => {
      if (!aiImg) return
      fabric.Image.fromURL(
        aiImg,
        (img) => {
          const max = 190
          const s = Math.min(max / img.width, 1)
          img.set({ left: 150, top: 46, scaleX: s, scaleY: s, cornerSize: 12 })
          if (target === viewRef.current) {
            const canvas = canvasRef.current
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()
            storeRef.current[target] = collectObjects()
          } else {
            storeRef.current[target] = [
              ...storeRef.current[target],
              { type: 'logo', src: aiImg, left: img.left, top: img.top, scaleX: s, scaleY: s, angle: 0, flipX: false, flipY: false },
            ]
          }
          toast.success(`Added to ${target} side — switch views to see it`)
        },
        { crossOrigin: 'anonymous' },
      )
    },
    [aiImg, collectObjects],
  )

  /* ---- Mode 2: AI Full Design Generator ---- */
  const blobToDataURL = (blob) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })

  const generateView = useCallback(async (prompt, view) => {
    const angle = view === 'front' ? 'straight-on front view' : view === 'back' ? 'rear back view' : 'side profile 45-degree angle'
    const p = `${prompt}, ${garmentRef.current.label.toLowerCase()} ${angle}, high quality product photo, white background, photorealistic, professional e-commerce, no watermark`
    const base = window.location.protocol === 'https:' ? 'https://image.pollinations.ai' : '/ai-img'
    let lastErr
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${base}/prompt/${encodeURIComponent(p)}?width=768&height=768&seed=${Math.floor(Math.random() * 999999)}&nologo=true`)
        if (!res.ok) throw new Error(`AI service replied ${res.status}`)
        const blob = await res.blob()
        return await blobToDataURL(blob)
      } catch (err) {
        lastErr = err
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)))
      }
    }
    throw lastErr
  }, [])

  const generateFullDesign = useCallback(async (views) => {
    if (!fullPrompt.trim()) return setFullGenErr('Describe the design you want')
    setFullGenErr('')
    setFullGenBusy(true)
    for (const view of views) {
      setFullGenImages((prev) => ({ ...prev, [view]: null }))
      try {
        const url = await generateView(fullPrompt.trim(), view)
        setFullGenImages((prev) => ({ ...prev, [view]: url }))
      } catch (err) {
        setFullGenErr(`Failed to generate ${view} view: ${err.message}`)
      }
    }
    setFullGenBusy(false)
  }, [fullPrompt, generateView])

  const addGeneratedToCart = useCallback(() => {
    const preview = fullGenImages[fullGenView]
    if (!preview) return
    const sizeVal = size || 'L'
    const design = {
      kind: 'generated',
      name: `${garment.label} · ${sizeVal}`,
      price: garment.price,
      qty: qty || 1,
      size: sizeVal,
      baseColor: baseRef.current,
      selectedView: fullGenView,
      views: fullGenImages,
      preview,
    }
    add(undefined, { size: sizeVal, custom: design })
    setAdded(true)
  }, [fullGenImages, fullGenView, garment, size, qty, add])

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

  /* visually scale the fixed-size canvas to match the column width */
  useEffect(() => {
    const wrapper = canvasRef.current?.wrapperEl
    if (!wrapper) return
    wrapper.style.transformOrigin = 'top left'
    wrapper.style.transform = `scale(${scale})`
  }, [scale])

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
              className="mx-auto w-full max-w-[500px] overflow-hidden"
              style={{ height: Math.round(500 * scale) }}
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
        <div className="card overflow-hidden p-5">
          <h4 className="flex items-center gap-2 font-display text-sm font-bold text-brand-900"><FaRobot className="text-accent" /> AI Design Studio</h4>
          <p className="mb-3 mt-1 text-[11px] leading-relaxed text-ink/50">
            Pick a mode — design art to place on the {garment.label.toLowerCase()}, or generate the full product design in every view.
          </p>

          {/* mode tabs */}
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-brand-50 p-1">
            <button onClick={() => setAiTab('art')} className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${aiTab === 'art' ? 'bg-white text-brand-900 shadow-sm' : 'text-ink/50 hover:text-ink/70'}`}>
              <FaMagic /> Design Art
            </button>
            <button onClick={() => setAiTab('full')} className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${aiTab === 'full' ? 'bg-white text-brand-900 shadow-sm' : 'text-ink/50 hover:text-ink/70'}`}>
              <FaEye /> Full Design
            </button>
          </div>

          {aiTab === 'art' && (
            <>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. golden lion mascot for a cricket team"
            className="field resize-none text-sm"
          />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-ink/40">Recommended prompts</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {aiChips.map((c) => (
              <button key={c} onClick={() => setAiPrompt(c)} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-100">
                {c}
              </button>
            ))}
          </div>
          <button onClick={generateAi} disabled={aiBusy} className="btn-dark mt-3 w-full py-2.5 text-sm">
            {aiBusy ? (
              <><FaSpinner className="animate-spin" /> Generating… (10–40s)</>
            ) : (
              <><FaMagic /> Generate Design</>
            )}
          </button>
          {aiBusy && <p className="mt-2 text-[11px] leading-relaxed text-ink/50">The free AI can take a moment — keep this page open, your design will appear here.</p>}
          {aiErr && <p className="mt-2 text-[11px] font-semibold text-red-600">{aiErr}</p>}
          {aiImg && !aiBusy && (
            <div className="mt-4 rounded-xl border border-ink/10 bg-white p-2">
              <img src={aiImg} alt="AI generated design" className="mx-auto aspect-square w-full max-w-[190px] rounded-lg object-cover ring-1 ring-ink/10" />
              <p className="mt-1.5 text-center text-[10px] text-ink/40">Then drag/resize it on the shirt</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <button onClick={() => applyAiTo('front')} className="rounded-lg bg-brand-700 py-1.5 text-xs font-bold text-white hover:bg-brand-800">Front</button>
                <button onClick={() => applyAiTo('back')} className="rounded-lg bg-brand-700 py-1.5 text-xs font-bold text-white hover:bg-brand-800">Back</button>
                <button onClick={() => { applyAiTo('front'); applyAiTo('back') }} className="rounded-lg bg-accent py-1.5 text-xs font-bold text-white hover:bg-accent-600">Both</button>
              </div>
            </div>
          )}
            </>
          )}

          {aiTab === 'full' && (
            <>
          <p className="mb-3 text-[11px] leading-relaxed text-ink/50">
            Describe the whole {garment.label.toLowerCase()} and AI generates real product photos — front, back &amp; side — ready to order.
          </p>
          <textarea
            value={fullPrompt}
            onChange={(e) => setFullPrompt(e.target.value)}
            rows={2}
            placeholder={`e.g. navy ${garment.label.toLowerCase()} with a golden eagle on the chest`}
            className="field resize-none text-sm"
          />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-ink/40">Recommended prompts</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {fullIdeas.map((c) => (
              <button key={c.label} onClick={() => setFullPrompt(c.prompt)} className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-100">
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <button onClick={() => generateFullDesign(['front'])} disabled={fullGenBusy} className="rounded-lg border border-brand-700 py-2 text-xs font-bold text-brand-700 hover:bg-brand-50">Front</button>
            <button onClick={() => generateFullDesign(['back'])} disabled={fullGenBusy} className="rounded-lg border border-brand-700 py-2 text-xs font-bold text-brand-700 hover:bg-brand-50">Back</button>
            <button onClick={() => generateFullDesign(['side'])} disabled={fullGenBusy} className="rounded-lg border border-brand-700 py-2 text-xs font-bold text-brand-700 hover:bg-brand-50">Side</button>
          </div>
          <button onClick={() => generateFullDesign(['front', 'back', 'side'])} disabled={fullGenBusy || !fullPrompt.trim()} className="btn-dark mt-2 w-full py-2.5 text-sm">
            {fullGenBusy ? <><FaSpinner className="animate-spin" /> Generating views…</> : <><FaRobot /> Generate Full Design (All Views)</>}
          </button>
          {fullGenBusy && <p className="mt-2 text-[11px] leading-relaxed text-ink/50">Each view takes ~5–10s on the free AI — images appear below as they finish.</p>}
          {fullGenErr && <p className="mt-2 text-[11px] font-semibold text-red-600">{fullGenErr}</p>}

          {(fullGenImages.front || fullGenImages.back || fullGenImages.side) && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink/50">All generated views</p>
              <div className="grid grid-cols-3 gap-1.5">
                {['front', 'back', 'side'].map((view) => (
                  <button
                    key={view}
                    onClick={() => fullGenImages[view] && setFullGenView(view)}
                    className={`overflow-hidden rounded-lg ring-2 transition ${view === fullGenView && fullGenImages[view] ? 'ring-accent' : 'ring-transparent'} ${fullGenImages[view] ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex aspect-square items-center justify-center bg-[#F3F4F1]">
                      {fullGenImages[view] ? (
                        <img src={fullGenImages[view]} alt={`${view} view of ${garment.label}`} className="h-full w-full object-contain" />
                      ) : (
                        <FaSpinner className="animate-spin text-ink/30" />
                      )}
                    </div>
                    <span className="block py-1 text-center text-[9px] font-bold uppercase tracking-wide text-ink/60 first-letter:capitalize">{view}</span>
                  </button>
                ))}
              </div>
              {fullGenImages[fullGenView] && (
                <div className="mt-3 rounded-xl border border-ink/10 bg-white p-2">
                  <img src={fullGenImages[fullGenView]} alt={`Selected ${fullGenView} view design`} className="mx-auto aspect-square w-full max-w-[230px] rounded-lg object-cover ring-1 ring-ink/10" />
                  <p className="mt-1.5 text-center text-[10px] text-ink/40">Preview: {fullGenView} view</p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {sizes.map((s) => (
                      <button key={s} onClick={() => setSize(s)} className={`rounded-lg border py-1.5 text-xs font-bold ${size === s ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink/15 text-ink/70'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <button onClick={addGeneratedToCart} className="btn-primary mt-2 w-full py-2.5 text-sm">
                    Order This Full Design — {inr(garment.price * (qty || 1))}
                  </button>
                  {added && <p className="mt-2 text-center text-xs font-semibold text-emerald-600">Added to cart ✓</p>}
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>

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