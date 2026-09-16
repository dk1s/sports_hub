import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen, FaTimes, FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa'
import { categories } from '../../data/products'
import ProductImage from '../../components/ui/ProductImage'
import { Spinner, StatusBadge } from '../../components/ui/misc'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { useGetCatalogQuery, useCatalogSaveMutation, useCatalogResetMutation } from '../../services/apiSlice'
import { inr, cn, uid } from '../../utils/format'

const blank = {
  id: '', slug: '', name: '', brand: 'Sports Hub', category: 'cricket-kit', subcategory: 'Bats',
  price: '', mrp: '', stock: 10, rating: 4.5, reviews: 0, sizes: '', description: '', features: '',
  badge: '', featured: false, bestseller: false, isNew: false, gradient: '#0E4637, #08251F',
}

export default function AdminProducts() {
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bulkPatch, setBulkPatch] = useState({})
  const confirm = useConfirm()

  const { data: list = [], isLoading, isError, refetch } = useGetCatalogQuery()
  const [catalogSave] = useCatalogSaveMutation()
  const [catalogReset] = useCatalogResetMutation()

  const filtered = useMemo(() => {
    if (!q.trim()) return list
    const t = q.toLowerCase()
    return list.filter((p) =>
      [p.name, p.brand, p.id, p.category, p.subcategory, (p.tags || []).join(' ')].join(' ').toLowerCase().includes(t),
    )
  }, [list, q])

  const persist = async (next) => {
    try {
      await catalogSave(next).unwrap()
      return true
    } catch (e) {
      toast.error('Could not save changes to this browser. ' + (e?.data?.message || e?.message || ''))
      return false
    }
  }

  const openNew = () => {
    const cat = categories[0]
    setForm({ ...blank, category: cat.slug, subcategory: cat.subcategories[0] })
    setShowForm(true)
  }
  const openEdit = (p) => {
    setForm({
      id: p.id, slug: p.slug, name: p.name, brand: p.brand, category: p.category, subcategory: p.subcategory,
      price: p.price, mrp: p.mrp, stock: p.stock, rating: p.rating, reviews: p.reviews,
      sizes: (p.sizes || []).join(', '), description: p.description || '', features: (p.features || []).join(' | '),
      badge: p.badge || '', featured: !!p.featured, bestseller: !!p.bestseller, isNew: !!p.isNew,
      gradient: (p.gradient || ['#0E4637', '#08251F']).join(', '),
    })
    setShowForm(true)
  }

  const validate = () => {
    const errs = []
    if (!form.name.trim()) errs.push('Name is required.')
    if (!form.brand.trim()) errs.push('Brand is required.')
    if (!(Number(form.price) > 0)) errs.push('Enter a valid price.')
    if (!(Number(form.mrp) >= Number(form.price))) errs.push('MRP must be ≥ price.')
    if (!(Number(form.stock) >= 0)) errs.push('Stock cannot be negative.')
    if (errs.length) toast.error(errs.join(' '))
    return errs.length === 0
  }

  const save = async () => {
    if (!validate()) return
    setSaving(true)
    const existing = editing
    const price = Number(form.price)
    const mrp = Number(form.mrp) || price
    const payload = {
      id: existing ? form.id : uid('p'),
      slug: existing ? form.slug : (form.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      categoryName: categories.find((c) => c.slug === form.category)?.name,
      subcategory: form.subcategory,
      price, mrp,
      stock: Number(form.stock),
      rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
      reviews: Number(form.reviews) || 0,
      sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : null,
      description: form.description.trim() || 'Great quality sports gear from ' + (form.brand.trim() || 'Sports Hub') + '.',
      features: form.features ? form.features.split('|').map((f) => f.trim()).filter(Boolean) : [],
      badge: form.badge || null,
      featured: form.featured, bestseller: form.bestseller, isNew: form.isNew,
      gradient: form.gradient ? form.gradient.split(',').map((g) => g.trim()) : ['#0E4637', '#08251F'],
      tags: [],
      createdAt: existing ? list.find((x) => x.id === form.id)?.createdAt : new Date().toISOString(),
    }
    const next = existing ? list.map((p) => (p.id === payload.id ? payload : p)) : [payload, ...list]
    const ok = await persist(next)
    if (ok) {
      setShowForm(false)
      setEditing(null)
      toast.success(existing ? 'Product updated' : 'Product created')
    }
    setSaving(false)
  }

  const remove = async (p) => {
    const ok = await confirm({
      title: `Delete “${p.name}”?`,
      message: 'This product will be removed from the storefront. This cannot be undone.',
      confirmLabel: 'Delete product',
      tone: 'danger',
    })
    if (!ok) return
    if (await persist(list.filter((x) => x.id !== p.id))) toast.success('Product deleted')
  }

  const applyBulk = async () => {
    const stock = Number(bulkPatch.stockDelta)
    if (!stock) return toast.error('Enter a stock value to add/subtract.')
    const next = list.map((p) => ({ ...p, stock: Math.max(0, p.stock + stock) }))
    if (await persist(next)) {
      toast.success(`Stock updated by ${stock} across all products`)
      setBulkPatch({})
    }
  }

  const resetDemo = async () => {
    const ok = await confirm({
      title: 'Reset demo catalog?',
      message: 'All your catalog edits will be lost and the original demo products restored.',
      confirmLabel: 'Reset catalog',
      tone: 'warning',
    })
    if (!ok) return
    try {
      await catalogReset().unwrap()
      toast.success('Catalog reset to defaults')
    } catch (e) {
      toast.error('Could not reset catalog. ' + (e?.data?.message || e?.message || ''))
    }
  }

  if (isLoading) return <Spinner />
  if (isError)
    return (
      <div className="card flex flex-col items-center px-6 py-16 text-center">
        <FaExclamationTriangle className="mb-3 text-amber-500" size={26} />
        <p className="font-display font-bold text-brand-900">Could not load the catalog</p>
        <button onClick={refetch} className="btn-primary mt-6 text-sm"><FaRedoAlt /> Try again</button>
      </div>
    )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="font-display text-2xl font-bold text-brand-900">Products</h1>
          <p className="text-sm text-ink/50">{list.length} products · changes reflect on the storefront instantly</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 text-sm"><FaPlus /> Add Product</button>
      </div>

      {/* toolbar */}
      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-ink/15 px-3 py-2">
          <FaSearch className="text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, brand, id…" className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={bulkPatch.stockDelta || ''} onChange={(e) => setBulkPatch({ stockDelta: e.target.value })} placeholder="Stock spread (±)" className="w-28 rounded-xl border border-ink/15 px-3 py-2 text-sm" />
          <button onClick={applyBulk} className="btn-dark py-2 text-xs"><FaBoxOpen /> Bulk update stock</button>
<button onClick={resetDemo} className="btn-outline py-2 text-xs">Reset demo catalog</button>
        </div>
      </div>

      {/* table */}
      <div className="card overflow-hidden">
        <div className="max-h-[68vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-brand-950 text-left text-xs font-bold uppercase tracking-wider text-white/80">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-brand-50/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage product={p} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[260px] truncate font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-ink/50">{p.brand} · {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">{p.categoryName}<br /><span className="text-ink/40">{p.subcategory}</span></td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-brand-800">{inr(p.price)}</p>
                    {p.mrp > p.price && <p className="text-xs text-ink/40 line-through">{inr(p.mrp)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('chip ring-1', p.stock <= 0 ? 'bg-red-50 text-red-700 ring-red-200' : p.stock <= 10 ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200')}>
                      {p.stock <= 0 ? <FaExclamationTriangle className="mr-1" /> : ''}{p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.badge && <StatusBadge status={p.badge} />}
                      {p.featured && <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">Featured</span>}
                      {p.bestseller && <span className="chip bg-accent text-white">Bestseller</span>}
                      {p.isNew && <span className="chip bg-violet-50 text-violet-700 ring-1 ring-violet-200">New</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { openEdit(p); setEditing(p) }} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-brand-50 hover:text-brand-700"><FaEdit /></button>
                      <button onClick={() => remove(p)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-red-50 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-sm text-ink/50">No products match “{q}”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative mx-auto my-8 w-[94%] max-w-3xl">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between bg-brand-950 px-6 py-4 text-white">
                <h2 className="font-display font-bold">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10"><FaTimes /></button>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="field-label">Product name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" /></div>
                <div><label className="field-label">Brand *</label><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="field" /></div>
                <div>
                  <label className="field-label">Category</label>
                  <select value={form.category} onChange={(e) => { const c = categories.find((x) => x.slug === e.target.value); setForm({ ...form, category: e.target.value, subcategory: c?.subcategories[0] }) }} className="field">
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Subcategory</label>
                  <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="field">
                    {categories.find((c) => c.slug === form.category)?.subcategories.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Sizes (comma separated, optional)</label>
                  <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="field" placeholder="S, M, L, XL" />
                </div>
                <div className="sm:col-span-2"><label className="field-label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" className="field resize-none" /></div>
                <div className="sm:col-span-2"><label className="field-label">Features (separate with |)</label><input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="field" placeholder="Grade-A willow | PU grip included" /></div>
                <div><label className="field-label">Selling price (₹) *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="field" /></div>
                <div><label className="field-label">MRP (₹)</label><input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="field" /></div>
                <div><label className="field-label">Stock *</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="field" /></div>
                <div><label className="field-label">Badge</label>
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} disabled={form.featured || form.bestseller} className="field">
                    <option value="">None</option><option>Bestseller</option><option>New</option><option>Low stock</option>
                  </select>
                </div>
                <div><label className="field-label">Gradient (3 hex, comma)</label><input value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className="field" placeholder="#0E4637, #08251F, #FF6B2C" /></div>
                <div className="flex flex-wrap items-end gap-4">
                  {[
                    ['featured', 'Featured'], ['bestseller', 'Bestseller'], ['isNew', 'New arrival'],
                  ].map(([k, label]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/70">
                      <input type="checkbox" checked={form[k]} onChange={(e) => {
                        const upd = { ...form, [k]: e.target.checked }
                        if (k === 'bestseller' && e.target.checked) upd.badge = 'Bestseller'
                        if (k === 'featured' && e.target.checked) upd.badge = upd.badge || 'Featured'
                        setForm(upd)
                      }} className="h-4 w-4 accent-accent" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-ink/8 bg-brand-50/40 px-6 py-4">
                <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary px-8 py-2.5 text-sm">{saving ? 'Saving…' : 'Save Product'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}