import { uid } from '../utils/format'

export const storeDefaults = {
  name: 'Sports Hub, Purnea',
  tagline: 'Gear Up. Play Hard. Win Big.',
  phone: '+91 82102 93271',
  whatsapp: '918210293271',
  email: 'hello@sportshubpurnea.com',
  address: 'Shop No. 4, MG Road, Near Clock Tower, Purnea, Bihar — 854301',
  mapEmbed:
    'https://www.google.com/maps?q=Purnea,Bihar,India&z=13&output=embed',
  timings: 'Mon – Sat: 10:00 AM – 9:00 PM · Sun: 11:00 AM – 7:00 PM',
  freeDeliveryAbove: 999,
  codAvailable: true,
  instagram: 'https://instagram.com/sportshubpurnea',
  facebook: 'https://facebook.com/sportshubpurnea',
}

export const coupons = [
  { code: 'SHUB10', type: 'percent', value: 10, minOrder: 0, active: true, label: '10% off your order' },
  { code: 'WIN20', type: 'percent', value: 20, minOrder: 1500, active: true, label: '20% off orders above ₹1500' },
  { code: 'JERSEY50', type: 'flat', value: 50, minOrder: 500, active: true, label: '₹50 off custom orders' },
]

export const testimonials = [
  {
    id: 't1',
    name: 'Amit Singh',
    role: 'Captain, Purnea Panthers',
    quote:
      'Played our entire district league with jerseys designed on this website. The printing quality shocked everyone — teams from other blocks asked us for the contact.',
    initials: 'AS',
    color: 'brand',
  },
  {
    id: 't2',
    name: 'Rohit Kumar',
    role: 'Father of junior cricketer',
    quote:
      'Ordered a junior kit + pads for my son. Delivery in Purnea was next day and cash on delivery made it stress-free. Genuine products at fair prices.',
    initials: 'RK',
    color: 'accent',
  },
  {
    id: 't3',
    name: 'Priya Verma',
    role: 'Badminton academy coach',
    quote:
      'Bought shuttles, rackets and net sets in bulk for our academy. The admin even helped me choose the right grip. Best sports shop in this area, hands down.',
    initials: 'PV',
    color: 'dark',
  },
]

export const faqs = [
  {
    q: 'Do you deliver to other towns outside Purnea?',
    a: 'Yes. We deliver across Bihar and India. Orders above ₹999 ship free; smaller orders attract a nominal shipping fee. Cash on Delivery is available in most locations.',
  },
  {
    q: 'How does the custom T-shirt / jersey design work?',
    a: 'Use the interactive designer to add your team logo and text, or simply submit a requirement form — tell us name, number, team, colour, fabric and quantity. We confirm the artwork in 24 hours before printing.',
  },
  {
    q: 'What is the turnaround time for custom jerseys?',
    a: 'Normally 5–7 working days after design approval. Rush orders (2–3 days) are available for an extra fee — just add a note in the special instructions.',
  },
  {
    q: 'Can I physically try products before buying?',
    a: 'Absolutely — visit our store on MG Road, Purnea, any day of the week. Walk in, try the bats, pads and sizes, and we will assist you in person.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery across the site. In-store you can pay by cash, UPI, or card at our counter.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unused products with tags can be returned within 7 days. Custom-printed jerseys are non-returnable unless they are defective or wrongly delivered.',
  },
]

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Cricket Kit', to: '/shop?category=cricket-kit' },
  { label: 'Cricket Apparel', to: '/shop?category=cricket-apparel' },
  { label: 'Other Sports', to: '/shop?category=other-sports' },
  { label: 'Custom Jersey', to: '/customize' },
  { label: 'Contact', to: '/contact' },
]

const daysAgo = (n, h = 10) =>
  new Date(Date.now() - n * 86400000 - h * 3600000).toISOString()

export const seedUsers = [
  {
    _id: 'u_admin',
    name: 'Store Admin',
    email: 'admin@sportshubpurnea.com',
    passwordHash: '$2b$10$Q4RzHwAbeRWCt9yWv/OmaO8lVLRW1EQXKvfRqK9uZQzrUhcRb3hK.',
    role: 'admin',
    blocked: false,
    phone: '+91 70000 00001',
    createdAt: daysAgo(120),
  },
  {
    _id: 'u_customer',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    passwordHash: '$2b$10$Q4RzHwAbeRWCt9yWv/OmaO8lVLRW1EQXKvfRqK9uZQzrUhcRb3hK.',
    role: 'customer',
    blocked: false,
    phone: '+91 98765 43210',
    createdAt: daysAgo(90),
  },
  {
    _id: 'u_arjun',
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    passwordHash: '$2b$10$Q4RzHwAbeRWCt9yWv/OmaO8lVLRW1EQXKvfRqK9uZQzrUhcRb3hK.',
    role: 'customer',
    blocked: false,
    createdAt: daysAgo(45),
  },
]

export const seedAddresses = [
  {
    id: 'addr_1',
    userId: 'u_customer',
    label: 'Home',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    line1: 'House 12, Nehru Nagar Colony',
    line2: 'Line Bazar Road',
    city: 'Purnea',
    state: 'Bihar',
    pincode: '854301',
    isDefault: true,
  },
  {
    id: 'addr_2',
    userId: 'u_customer',
    label: 'Office',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    line1: 'Shop 21, MG Road',
    city: 'Purnea',
    state: 'Bihar',
    pincode: '854301',
  },
]

const sampleDesignPreview = ({ base = '#1E805F', text = 'PANTHERS', number = '07', team = 'Purnea Panthers' }) => {
  const svg = (
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="${base}"/>` +
    `<path d="M150 120h300l20 300-170 100-170-100z" fill="${base}" stroke="rgba(255,255,255,.55)" stroke-width="4"/>` +
    `<path d="M170 150c50-30 210-30 260 0l-8 120c-50-25-195-25-245 0z" fill="${base}" stroke="rgba(255,255,255,.35)" stroke-width="3"/>` +
    `<circle cx="300" cy="210" r="62" fill="rgba(255,255,255,.92)"/>` +
    `<text x="300" y="238" font-family="System-ui" font-size="64" font-weight="800" text-anchor="middle" fill="#101828">${number}</text>` +
    `<text x="300" y="330" font-family="System-ui" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">${text}</text>` +
    `<text x="300" y="372" font-family="System-ui" font-size="15" text-anchor="middle" fill="rgba(255,255,255,.85)">${team}</text>` +
    `</svg>`
  )
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const seedOrders = [
  {
    _id: 'o_1001',
    no: 'SH-1001',
    userId: 'u_customer',
    items: [
      { productId: 'p001', name: 'SG Victory Kashmir Willow Cricket Bat', image: null, qty: 1, size: 'Short Handle', price: 2450, discount: 245 },
      { productId: 'p020', name: 'Sports Hub Pro Team Jersey', image: null, qty: 2, size: 'L', price: 799, discount: 0 },
    ],
    totals: { subtotal: 4048, discount: 245, shipping: 0, total: 4048 },
    customer: { name: 'Rahul Kumar', phone: '+91 98765 43210', email: 'rahul@example.com' },
    address: seedAddresses[0],
    payment: { method: 'COD', status: 'pending' },
    status: 'Shipped',
    placedAt: daysAgo(4),
    updatedAt: daysAgo(1),
    coupon: null,
  },
  {
    _id: 'o_1002',
    no: 'SH-1002',
    userId: 'u_customer',
    items: [
      { productId: 'p016', name: 'Sports Hub Powerplay T-Shirt (Cotton)', image: null, qty: 1, size: 'XL', price: 449, discount: 0 },
    ],
    totals: { subtotal: 449, discount: 0, shipping: 49, total: 498 },
    customer: { name: 'Rahul Kumar', phone: '+91 98765 43210', email: 'rahul@example.com' },
    address: seedAddresses[0],
    payment: { method: 'COD', status: 'paid' },
    status: 'Delivered',
    placedAt: daysAgo(18),
    updatedAt: daysAgo(11),
    coupon: null,
  },
  {
    _id: 'o_1003',
    no: 'SH-1003',
    userId: 'u_arjun',
    items: [
      { productId: 'p022', name: 'Cosco Senior Match Football (Size 5)', image: null, qty: 1, size: 'Size 5', price: 799, discount: 0 },
      { productId: 'p013', name: 'SG Supreme Full Wire Mask Helmet', image: null, qty: 1, size: 'M', price: 2390, discount: 0 },
    ],
    totals: { subtotal: 3189, discount: 0, shipping: 0, total: 3189 },
    customer: { name: 'Arjun Patel', phone: '+91 87654 32109', email: 'arjun@example.com' },
    address: { ...seedAddresses[1], name: 'Arjun Patel', phone: '+91 87654 32109' },
    payment: { method: 'COD', status: 'pending' },
    status: 'Confirmed',
    placedAt: daysAgo(2),
    updatedAt: daysAgo(1),
    coupon: 'SHUB10',
  },
  {
    _id: 'o_1004',
    no: 'SH-1004',
    userId: 'u_admin',
    items: [],
    totals: { subtotal: 0, discount: 0, shipping: 0, total: 0 },
    customer: { name: 'Demo Customer', phone: '+91 90000 00000', email: 'demo@example.com' },
    address: null,
    payment: { method: 'COD', status: 'cancelled' },
    status: 'Cancelled',
    placedAt: daysAgo(26),
    updatedAt: daysAgo(20),
    coupon: null,
  },
  {
    _id: 'o_1005',
    no: 'SH-1005',
    userId: 'u_arjun',
    items: [
      { productId: 'p004', name: 'Kookaburra King Cricket Ball (4-Piece)', image: null, qty: 12, size: null, price: 275, discount: 0 },
    ],
    totals: { subtotal: 3300, discount: 0, shipping: 0, total: 3300 },
    customer: { name: 'Purnea Cricket Academy', phone: '+91 87654 32109', email: 'academy@example.com' },
    address: seedAddresses[1],
    payment: { method: 'COD', status: 'paid' },
    status: 'Delivered',
    placedAt: daysAgo(34),
    updatedAt: daysAgo(25),
    coupon: null,
  },
]

export const seedCustomOrders = [
  {
    _id: 'c_5001',
    no: 'CT-5001',
    userId: 'u_customer',
    name: 'Purnea Panthers — Junior Team',
    design: {
      type: 'jersey',
      view: 'front',
      baseColor: '#1E805F',
      textColor: '#ffffff',
      text: 'PANTHERS',
      number: '07',
      team: 'Purnea Panthers',
      fabric: 'Sublimation Mesh',
    },
    garment: { type: 'Team Jersey (Sublimated)', size: ['S', 'M', 'L'], color: 'Green / White' },
    qty: 12,
    price: 649,
    sizeChart: 'S: 36-38" chest, M: 38-40", L: 40-42"',
    specialNotes: 'Please add sponsor name "Panchhi" on the back sleeve. Need by next month league.',
    logo: null,
    preview: sampleDesignPreview({ base: '#1E805F', text: 'PANTHERS', number: '07', team: 'Purnea Panthers' }),
    status: 'In Review',
    adminNotes: 'Awaiting sponsor logo from the captain.',
    created: daysAgo(3),
    updated: daysAgo(2),
  },
  {
    _id: 'c_5002',
    no: 'CT-5002',
    userId: 'u_arjun',
    name: 'Birthday T-Shirt Set',
    design: {
      type: 'tshirt',
      view: 'front',
      baseColor: '#FF6B2C',
      textColor: '#101828',
      text: 'VIRAT',
      number: '18',
      team: 'Kohli Fan Club',
      fabric: 'Combed Cotton 180 GSM',
    },
    garment: { type: 'Round-Neck T-Shirt', size: ['L', 'XL'], color: 'Orange / Black' },
    qty: 6,
    price: 449,
    specialNotes: 'Keep it simple, number on back as well.',
    logo: null,
    preview: sampleDesignPreview({ base: '#FF6B2C', text: 'VIRAT', number: '18', team: 'Kohli Fan Club' }),
    status: 'Approved — Printing',
    adminNotes: '',
    created: daysAgo(6),
    updated: daysAgo(1),
  },
]

export const seedMessages = [
  {
    _id: 'm_9001',
    name: 'Mohit Jha',
    email: 'mohit@example.com',
    phone: '+91 91234 56789',
    subject: 'Bulk order for school team',
    message: 'We need 15 full cricket kits (bat, pads, gloves, helmet) for our school under-14 team. Can you share a bulk quote?',
    status: 'new',
    created: daysAgo(1, 16),
  },
  {
    _id: 'm_9002',
    name: 'Sana Sheikh',
    email: 'sana@example.com',
    phone: '+91 99887 76655',
    subject: 'Women cricket jersey availability',
    message: 'Do you make women-sized cricket jerseys? Looking for 8 pieces in blue.',
    status: 'read',
    created: daysAgo(2, 11),
  },
]

export const seedSettings = storeDefaults