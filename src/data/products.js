const d = (y, m, day) => new Date(Date.UTC(y, m - 1, day)).toISOString()

const mk = (base) => ({
  badge: null,
  featured: false,
  bestseller: false,
  isNew: false,
  sizes: null,
  ...base,
})

export const categories = [
  {
    slug: 'cricket-kit',
    name: 'Cricket Kit',
    tagline: 'Bats, balls, pads, gloves & full protection',
    subcategories: ['Bats', 'Balls', 'Tennis Balls', 'Leather Balls', 'Pads', 'Batting Gloves', 'Keeping Gloves', 'Helmets', 'Stumps', 'Box Guards', 'Thigh Pads', 'Arm Guards', 'Chest Guards', 'Cricket Shoes', 'Sweatbands & Socks', 'Kit Bags'],
    gradient: ['#0E4637', '#08251F'],
    icon: 'bat',
  },
  {
    slug: 'cricket-apparel',
    name: 'Cricket Apparel',
    tagline: 'Tees, shirts, lowers & jerseys',
    subcategories: ['T-Shirts', 'Shirts', 'Lowers', 'Jerseys'],
    gradient: ['#C93C07', '#822C10'],
    icon: 'jersey',
  },
  {
    slug: 'other-sports',
    name: 'Other Sports',
    tagline: 'Football, badminton & basketball',
    subcategories: ['Football', 'Badminton', 'Basketball'],
    gradient: ['#1E3A8A', '#101828'],
    icon: 'football',
  },
]

const P = (p) => ({
  _id: p.id,
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  categoryName: categories.find((c) => c.slug === p.category)?.name,
  subcategory: p.subcategory,
  price: p.price,
  mrp: p.mrp,
  stock: p.stock,
  rating: p.rating ?? Math.round((4 + Math.random() * 0.9) * 10) / 10,
  reviews: p.reviews ?? Math.floor(8 + Math.random() * 120),
  sizes: p.sizes ?? null,
  colors: p.colors ?? ['#0E4637', '#FF6B2C', '#101828'],
  description: p.description,
  features: p.features ?? [],
  tags: p.tags ?? [],
  badge: p.badge ?? null,
  featured: p.featured ?? false,
  bestseller: p.bestseller ?? false,
  isNew: p.isNew ?? false,
  createdAt: p.createdAt ?? d(2025, 6, 1),
  gradient: p.gradient ?? ['#0E4637', '#08251F'],
})

const seedCatalog = [
  P({ id: 'p001', slug: 'sg-victory-kashmir-willow-bat', name: 'SG Victory Kashmir Willow Cricket Bat', brand: 'SG', category: 'cricket-kit', subcategory: 'Bats', price: 2450, mrp: 3200, stock: 14, sizes: ['Short Handle', 'Long Handle'], description: 'Hand-crafted Kashmir willow bat with a beefed-up spine and a large sweet spot. Perfect for hard tennis balls and leather on village teas.', features: ['Grade-A Kashmir willow', 'High profile with lower sweet spot', 'PU grip included', 'Weight: 1.19 – 1.24 kg'], tags: ['popular'], badge: 'Bestseller', bestseller: true, featured: true, gradient: ['#7C5A2A', '#4A330F'] }),

  P({ id: 'p002', slug: 'mrf-genius-edition-series-100', name: 'MRF Genius Edition Series 100 Bat', brand: 'MRF', category: 'cricket-kit', subcategory: 'Bats', price: 4990, mrp: 6200, stock: 6, sizes: ['Short Handle', 'Long Handle'], description: 'Premium handmade English willow bat with pressed edges and a cambered spine — gives power shots that travel.', features: ['Grade-1 English willow', 'Thick edges 40mm+', 'Authentic MRF stickers', 'Knocked-in on request'], tags: ['pro'], badge: 'New', isNew: true, featured: true, gradient: ['#8A6A34', '#5C4418'] }),

  P({ id: 'p003', slug: 'bd-sumer-cricket-bat', name: 'BD Sumer Cricket Bat (Hardball/Leather)', brand: 'BD', category: 'cricket-kit', subcategory: 'Bats', price: 1899, mrp: 2400, stock: 20, sizes: ['Short Handle'], description: 'Reliable wooden bat for club and practice nets. Well balanced with a full toe guard fitted.', features: ['Kashmir willow', 'Toe guard included', 'Ideal for tennis-ball cricket'], tags: [], gradient: ['#9C7A3E', '#66511F'] }),

  P({ id: 'p004', slug: 'kookaburra-king-leather-ball', name: 'Kookaburra King Cricket Ball (4-Piece)', brand: 'Kookaburra', category: 'cricket-kit', subcategory: 'Leather Balls', price: 275, mrp: 350, stock: 120, description: 'Tour-grade 4-piece leather cricket ball for hard-ball league play. Consistent seam and shine.', features: ['4-piece full-grain leather', 'Hand-stitched 76 threads', 'Weight 5.5 oz'], tags: ['popular'], bestseller: true, gradient: ['#C0392B', '#7C2018'] }),

  P({ id: 'p005', slug: 'cosco-trainer-cricket-ball', name: 'Cosco Tennis Trainer Balls (Pack of 6)', brand: 'Cosco', category: 'cricket-kit', subcategory: 'Tennis Balls', price: 520, mrp: 650, stock: 80, description: 'Packed set of six hard tennis trainer balls for net practice and gully cricket.', features: ['Pack of 6', 'Good bounce & grip', 'Ideal for tennis-ball matches'], tags: [], gradient: ['#E67E22', '#A05A12'] }),

  P({ id: 'p006', slug: 'sg-test-leather-ball', name: 'SG Test Red Leather Cricket Ball', brand: 'SG', category: 'cricket-kit', subcategory: 'Leather Balls', price: 1750, mrp: 2100, stock: 24, description: 'India-tested red leather ball, hand-stitched for durability on hard pitches.', features: ['Test match grade', 'High-swing polish', 'Robust seam for seamers'], tags: ['pro'], gradient: ['#B03A2E', '#6E1F16'] }),

  P({ id: 'p007', slug: 'ss-tube-pads-xl', name: 'SS Tube Pads with EVA Foam (Adult)', brand: 'SS', category: 'cricket-kit', subcategory: 'Pads', price: 1650, mrp: 2100, stock: 18, sizes: ['S', 'M', 'L', 'XL'], description: 'Feather-light tube pads with high-density EVA foam and cane-less construction for fast feet.', features: ['EVA multi-piece design', 'Caprivate buckle straps', 'One-piece split toe'], tags: ['popular'], bestseller: true, gradient: ['#0E4637', '#08251F'] }),

  P({ id: 'p008', slug: 'sg-pro-guardian-pads', name: 'SG Pro Guardian Cane Pads', brand: 'SG', category: 'cricket-kit', subcategory: 'Pads', price: 2200, mrp: 2800, stock: 9, sizes: ['M', 'L', 'XL'], description: 'Traditional cane pads with thick PVC side wings — maximum protection for pace bowling.', features: ['Cane + EVA mix', 'PVC wing protection', '6 straps for a snug fit'], tags: ['pro'], gradient: ['#143D59', '#0B2333'] }),

  P({ id: 'p009', slug: 'mrf-ultra-gloves', name: 'MRF Ultra Classic Batting Gloves', brand: 'MRF', category: 'cricket-kit', subcategory: 'Batting Gloves', price: 1950, mrp: 2500, stock: 15, sizes: ['S', 'M', 'L', 'XL'], description: 'Sublime soft-feel palm batting gloves with U-shaped sidebars and a breathable back.', features: ['Goat-skin soft palm', 'Polyurethane covering', 'Velcro closure'], tags: [], featured: true, gradient: ['#0E4637', '#FF6B2C'] }),

  P({ id: 'p010', slug: 'sg-keeping-gloves', name: 'SG Goldline Wicket Keeping Gloves', brand: 'SG', category: 'cricket-kit', subcategory: 'Keeping Gloves', price: 1250, mrp: 1600, stock: 12, sizes: ['M', 'L', 'XL'], description: 'Lightweight keeping gloves with concave foam fingers and great ball control behind the stumps.', features: ['Concave foam moulding', 'Pre-curved fingers', 'Mesh back for airflow'], tags: [], gradient: ['#B8860B', '#6E4F0E'] }),

  P({ id: 'p011', slug: 'ss-elbow-guard', name: 'SS Arm & Elbow Guard Combo', brand: 'SS', category: 'cricket-kit', subcategory: 'Arm Guards', price: 899, mrp: 1150, stock: 25, sizes: ['S', 'M', 'L'], description: 'Combined forearm and elbow guard with moulded PC shell and adjustable straps.', features: ['Moulded PC shell', 'Comfort foam padding', 'Elastic strapping'], tags: [], gradient: ['#34495E', '#1B2631'] }),

  P({ id: 'p012', slug: 'bd-helmet-pro-shield', name: 'BD Pro Shield Cricket Helmet', brand: 'BD', category: 'cricket-kit', subcategory: 'Helmets', price: 1399, mrp: 1700, stock: 16, sizes: ['M', 'L', 'XL'], description: 'Steel-grille helmet with superior padding, CK-certified for fast bowling protection.', features: ['Crash-absorbing liner', 'Adjustable backstrap', 'Performance grille'], tags: [], gradient: ['#0E4637', '#FF6B2C'] }),

  P({ id: 'p013', slug: 'sg-full-wire-mask-helmet', name: 'SG Supreme Full Wire Mask Helmet', brand: 'SG', category: 'cricket-kit', subcategory: 'Helmets', price: 2390, mrp: 2900, stock: 7, sizes: ['M', 'L'], description: 'All-weather full coverage with extended side protection for short-pitched bowling.', features: ['Full wire mask', 'Dual-density EVA', 'Sweat-absorbing liner'], tags: ['pro'], gradient: ['#1B2631', '#0B1318'] }),

  P({ id: 'p014', slug: 'cosco-stumps-set', name: 'Cosco Nylon Stumps Set (3 Stumps + 2 Bails)', brand: 'Cosco', category: 'cricket-kit', subcategory: 'Stumps', price: 649, mrp: 800, stock: 30, description: 'Weatherproof nylon stumps with wooden bails — storage-ready and light to carry.', features: ['Nylon poles', 'Wooden bails', 'Easy carry'], tags: [], gradient: ['#27AE60', '#177A3F'] }),

  P({ id: 'p015', slug: 'sh-compact-kit-bag', name: 'Sports Hub Compact Kit Bag', brand: 'Sports Hub', category: 'cricket-kit', subcategory: 'Kit Bags', price: 1499, mrp: 1900, stock: 11, description: 'Spacious wheeled kit bag with dedicated bat sleeve, shoe pocket and waterproof base.', features: ['Bat sleeve inside', 'Wheeled base', 'Heavy-duty zips'], tags: [], badge: 'New', isNew: true, gradient: ['#101828', '#0E4637'] }),

  P({ id: 'p016', slug: 'sh-stylish-casual-tshirt', name: 'Sports Hub Powerplay T-Shirt (Cotton)', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'T-Shirts', price: 449, mrp: 599, stock: 60, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Breathable 180 GSM combed cotton tee with a sporty chest print. Great for practice and casual wear.', features: ['100% combed cotton', 'Regular fit', 'Crew neck', 'Fade-resistant print'], tags: ['popular'], bestseller: true, gradient: ['#0E4637', '#08251F'] }),

  P({ id: 'p017', slug: 'sh-dry-fit-training-tee', name: 'Sports Hub Dry-Fit Training Tee', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'T-Shirts', price: 549, mrp: 749, stock: 45, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Moisture-wicking dry-fit tee that keeps you cool during nets and drills.', features: ['Moisture-wick fabric', 'Anti-odour finish', 'Athletic fit'], tags: [], gradient: ['#FF6B2C', '#C93C07'] }),

  P({ id: 'p018', slug: 'max-sports-half-sleeve-shirt', name: 'Max Sports Collared Half-Sleeve Shirt', brand: 'Max Sports', category: 'cricket-apparel', subcategory: 'Shirts', price: 699, mrp: 899, stock: 34, sizes: ['M', 'L', 'XL', 'XXL'], description: 'Crisp mesh collared shirt for matches on warm afternoons. Quick-dry and move-friendly.', features: ['Mesh weave', 'Collared styling', 'Quick-dry'], tags: [], gradient: ['#1E3A8A', '#101828'] }),

  P({ id: 'p019', slug: 'sh-flexi-track-lower', name: 'Sports Hub Flexi Track Lower', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'Lowers', price: 599, mrp: 799, stock: 40, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Stretchable track lower with inner drawcord and deep zip pockets for training and travel.', features: ['4-way stretch', 'Two deep pockets', 'Drawcord waist'], tags: ['popular'], bestseller: true, gradient: ['#0E4637', '#101828'] }),

  P({ id: 'p020', slug: 'sh-pro-team-jersey', name: 'Sports Hub Pro Team Jersey', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'Jerseys', price: 799, mrp: 1099, stock: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Match-day jersey with sublimation-ready fabric — team name, number and sponsor can be printed.', features: ['Sublimation fabric', 'Slim athletic cut', 'Print-ready panels'], tags: ['popular'], featured: true, gradient: ['#D9F044', '#0E4637'] }),

  P({ id: 'p021', slug: 'sh-sublimation-fan-jersey', name: 'Sports Hub Fan Edition Jersey (11 Colours)', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'Jerseys', price: 649, mrp: 849, stock: 8, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Support your team in a lightweight, comfortable matchday jersey with printed name option.', features: ['Breathable knit', 'Printed back name', 'Raglan sleeve'], tags: [], badge: 'Low stock', gradient: ['#FF6B2C', '#101828'] }),

  P({ id: 'p022', slug: 'cosco-football-senior', name: 'Cosco Senior Match Football (Size 5)', brand: 'Cosco', category: 'other-sports', subcategory: 'Football', price: 799, mrp: 1050, stock: 42, description: 'Machine-stitched TPU football tuned for grass and hard ground. FIFA-quality feel on a budget.', features: ['TPU outer casing', 'Machine stitched 32 panels', 'Butyl bladder'], tags: ['popular'], bestseller: true, gradient: ['#1E3A8A', '#0B1B3D'] }),

  P({ id: 'p023', slug: 'yonex-mavis-600-shuttles', name: 'Yonex Mavis 600 Nylon Shuttles (Pack of 6)', brand: 'Yonex', category: 'other-sports', subcategory: 'Badminton', price: 540, mrp: 680, stock: 70, description: 'Tournament-grade nylon shuttlecock with consistent flight for practice and club nights.', features: ['Nylon (durable)', 'Close-to-feather flight', 'Pack of 6'], tags: [], gradient: ['#C8A951', '#8F7428'] }),

  P({ id: 'p024', slug: 'cosco-badminton-racket-pair', name: 'Cosco Rally Badminton Racket Pair', brand: 'Cosco', category: 'other-sports', subcategory: 'Badminton', price: 949, mrp: 1200, stock: 22, description: 'Two lightweight aluminium rackets with full cover — perfect starter pair for families.', features: ['Aluminium frame', 'Light grip', '2 + cover included'], tags: [], gradient: ['#0E4637', '#FF6B2C'] }),

  P({ id: 'p025', slug: 'cosco-basketball-7', name: 'Cosco Defender Basketball (Size 7)', brand: 'Cosco', category: 'other-sports', subcategory: 'Basketball', price: 899, mrp: 1150, stock: 28, description: 'Rubberised composite basketball with deep channels for control on outdoor courts.', features: ['Composite rubber', 'Deep channel grip', 'Size 7 (men)'], tags: [], gradient: ['#E67E22', '#8A4A0B'] }),

  P({ id: 'p026', slug: 'sg-guardian-thigh-guard', name: 'SG Thigh Guard (Right Hand)', brand: 'SG', category: 'cricket-kit', subcategory: 'Thigh Pads', price: 549, mrp: 700, stock: 19, sizes: ['One Size'], description: 'Protective thigh pad worn inside trousers with high-density EVA shell.', features: ['EVA shell', 'Comfort liner', 'Elastic belt'], tags: [], gradient: ['#34495E', '#1B2631'] }),

  P({ id: 'p027', slug: 'sh-net-practice-ball-pack', name: 'Sports Hub Net Practice Cricket Ball Set (10)', brand: 'Sports Hub', category: 'cricket-kit', subcategory: 'Balls', price: 999, mrp: 1250, stock: 38, description: 'Ten stitched practise balls for teams and academies — consistent bounce, easy to mark.' , features: ['10 balls', 'Training grade', 'Mark with marker easily'], tags: ['popular'], gradient: ['#C0392B', '#7C2018'] }),

  P({ id: 'p028', slug: 'sh-fan-tshirt-gotv', name: 'Sports Hub Fan T-Shirt (Neon)', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'T-Shirts', price: 399, mrp: 520, stock: 32, sizes: ['S', 'M', 'L', 'XL'], description: 'Vibrant neon fan tee for the stands — high-visibility, comfy and machine-washable.', features: ['140 GSM cotton', 'Neon shade', 'Unisex fit'], tags: [], isNew: true, gradient: ['#D9F044', '#0E4637'] }),

  P({ id: 'p029', slug: 'bd-wicket-gloves-youth', name: 'BD Youth Batting Gloves (Junior)', brand: 'BD', category: 'cricket-kit', subcategory: 'Batting Gloves', price: 999, mrp: 1250, stock: 21, sizes: ['Junior M', 'Junior L'], description: 'Junior batting gloves with safe foam padding for young players learning the game.', features: ['Soft foam knuckle', 'Flexible palm', 'Junior sizing'], tags: [], gradient: ['#FF6B2C', '#8A3B0E'] }),

  P({ id: 'p030', slug: 'sh-classic-t-shirt-pack', name: 'Sports Hub Classic Tee Value Pack (3 Pcs)', brand: 'Sports Hub', category: 'cricket-apparel', subcategory: 'T-Shirts', price: 999, mrp: 1350, stock: 26, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Three plain cotton tees in charcoal, white and forest green — the training wardrobe sorted.', features: ['3 tees', 'Plain colours', 'Pre-shrunk cotton'], tags: ['popular'], bestseller: true, gradient: ['#3C4A5A', '#101828'] }),

  P({ id: 'p031', slug: 'sg-chest-guard-eva', name: 'SG Chest Guard (EVA Shell)', brand: 'SG', category: 'cricket-kit', subcategory: 'Chest Guards', price: 999, mrp: 1300, stock: 16, sizes: ['One Size'], description: 'Lightweight chest protection with impact-absorbing EVA shell and elastic straps — worn under the jersey against short balls.', features: ['High-density EVA shell', 'Ventilated foam liner', 'Elastic clip straps'], tags: [], gradient: ['#34495E', '#1B2631'] }),

  P({ id: 'p032', slug: 'ss-box-abdominal-guard', name: 'SS Box Abdominal Guard', brand: 'SS', category: 'cricket-kit', subcategory: 'Box Guards', price: 399, mrp: 520, stock: 24, sizes: ['One Size'], description: 'Ergonomic abdominal box guard with curved shell and breathable pouch for a secure, low-profile fit.', features: ['Impact-safe ABS shell', 'Breathable fabric pouch', 'Curved ergonomic fit'], tags: ['popular'], bestseller: true, gradient: ['#2C3E50', '#141B21'] }),

  P({ id: 'p033', slug: 'ss-cricket-shoes-studs', name: 'SS Cricket Shoes with Studs (Adult)', brand: 'SS', category: 'cricket-kit', subcategory: 'Cricket Shoes', price: 1699, mrp: 2199, stock: 12, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'], description: 'Seasoned spike shoes built for grip on turf — cushioned footbed and reinforced toecap for fast bowlers.', features: ['Full-grain upper', 'Riveted spikes', 'Cushioned insole', 'Mid-top ankle support'], tags: ['pro'], featured: true, gradient: ['#0E4637', '#08251F'] }),

  P({ id: 'p034', slug: 'bd-spike-cricket-shoes', name: 'BD Spike Cricket Shoes (Hard Ground)', brand: 'BD', category: 'cricket-kit', subcategory: 'Cricket Shoes', price: 1299, mrp: 1650, stock: 18, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'], description: 'All-rounder mystic spike shoes for hard ground and artificial turf — light, breathable and stable.', features: ['Mesh + PU upper', '6-stud hard-ground sole', 'Removable insole'], tags: [], badge: 'New', isNew: true, gradient: ['#1E3A8A', '#101828'] }),

  P({ id: 'p035', slug: 'sh-sports-socks-sweatband', name: 'Sports Hub Cricket Socks + Sweatband Combo', brand: 'Sports Hub', category: 'cricket-kit', subcategory: 'Sweatbands & Socks', price: 299, mrp: 420, stock: 60, sizes: ['S', 'M', 'L'], description: 'Moisture-wicking ankle socks plus a matching cushion sweatband — the match-day combo.', features: ['2 pairs socks + 1 sweatband', 'Moisture-wicking knit', 'Terry sole cushion'], tags: ['popular'], bestseller: true, gradient: ['#FF6B2C', '#C93C07'] }),

  P({ id: 'p036', slug: 'cosco-tennis-cricket-ball', name: 'Cosco Tennis Cricket Ball', brand: 'Cosco', category: 'cricket-kit', subcategory: 'Tennis Balls', price: 75, mrp: 95, stock: 200, description: 'Rubber tennis cricket ball with consistent bounce — the gully-cricket favourite, sold individually.', features: ['Rubber core', 'Consistent bounce', 'Sewn seam grip'], tags: [], gradient: ['#F1C40F', '#B98A08'] }),

  P({ id: 'p037', slug: 'kookaburra-white-leather-ball-t20', name: 'Kookaburra White Leather Ball (T20)', brand: 'Kookaburra', category: 'cricket-kit', subcategory: 'Leather Balls', price: 2350, mrp: 2800, stock: 10, description: 'White leather ball tuned for white-ball cricket — dual-sided shine and a seam that swings late.', features: ['White full-grain leather', 'T20 dual-swing seam', 'Weight 5.5 oz'], tags: ['pro'], gradient: ['#E8E8E8', '#7D7D7D'] }),

  P({ id: 'p038', slug: 'sg-duffle-cricket-kit-bag', name: 'SG Duffle Cricket Kit Bag', brand: 'SG', category: 'cricket-kit', subcategory: 'Kit Bags', price: 1799, mrp: 2300, stock: 9, description: 'Roomy duffle kit bag with internal bat sleeve, separate shoe pocket and padded shoulder strap.', features: ['Internal bat sleeve', 'Shoe & wet pocket', 'Padded carry strap', 'Heavy-duty zips'], tags: [], featured: true, gradient: ['#101828', '#0E4637'] }),

  P({ id: 'p039', slug: 'sh-coffin-cricket-kit-bag', name: 'Sports Hub Coffin Cricket Kit Bag', brand: 'Sports Hub', category: 'cricket-kit', subcategory: 'Kit Bags', price: 1299, mrp: 1699, stock: 14, description: 'Classic coffin-shaped bag that keeps three bats, pads and gloves organised with quick-access stud closures.', features: ['Holds 3 bats', 'Big padded pads section', 'Quick-access stud pocket', 'Waterproof base'], tags: [], badge: 'New', isNew: true, gradient: ['#0E4637', '#08251F'] }),
]

/* ------------------------------------------------------------------
   Generated expansion: 100 more products (p100–p199) so every category
   and subcategory has a deep, well-stocked catalog. The generator is
   deterministic (index-based), so slugs/ids/prices stay stable between
   reloads.
------------------------------------------------------------------ */
const KIT_PAL = [['#0E4637', '#08251F'], ['#7C5A2A', '#4A330F'], ['#C0392B', '#7C2018'], ['#143D59', '#0B2333'], ['#34495E', '#1B2631'], ['#1B2631', '#0B1318'], ['#101828', '#0E4637'], ['#8A6A34', '#5C4418']]
const APP_PAL = [['#0E4637', '#FF6B2C'], ['#FF6B2C', '#C93C07'], ['#1E3A8A', '#101828'], ['#D9F044', '#0E4637'], ['#3C4A5A', '#101828']]
const OTH_PAL = [['#1E3A8A', '#0B1B3D'], ['#E67E22', '#8A4A0B'], ['#C8A951', '#8F7428'], ['#27AE60', '#177A3F']]

const ri = (i, m) => (i * 37 + 11) % m // deterministic pseudo-random
const priceOf = (lo, hi, i) => {
  const span = hi - lo
  const v = lo + Math.round((span * ri(i, 13)) / 12)
  return Math.max(Math.round(v / 5) * 5, 149)
}

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const EQUIP_SIZES = ['S', 'M', 'L', 'XL']
const SHOE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']
const ONE_SIZE = ['One Size']
const BALL_SIZES = null

const PRICE = {
  Bats: [1899, 5499], Balls: [249, 899], 'Tennis Balls': [65, 149], 'Leather Balls': [1399, 2599], Pads: [1299, 2499],
  'Batting Gloves': [1299, 2499], 'Keeping Gloves': [1099, 1899], Helmets: [1199, 2399], Stumps: [549, 999],
  'Box Guards': [299, 599], 'Thigh Pads': [449, 849], 'Arm Guards': [499, 999], 'Chest Guards': [699, 1199],
  'Cricket Shoes': [1299, 2299], 'Sweatbands & Socks': [199, 449], 'Kit Bags': [1199, 2199],
  'T-Shirts': [299, 649], Shirts: [499, 899], Lowers: [449, 799], Jerseys: [549, 899],
  Football: [699, 1499], Badminton: [399, 1299], Basketball: [649, 1299],
}

const G = {
  Bats: { cat: 'cricket-kit', n: 5, suffix: 'Cricket Bat', sizes: ['Short Handle', 'Long Handle', 'Harwood (Junior)'], brands: ['SG', 'MRF', 'BD', 'Kookaburra', 'SS', 'DSC', 'Sports Hub'], names: ['Dominator X', 'Thunder Blade', 'Air Flo 1000', 'Power Drive', 'Classic Pro'], desc: 'Balanced willow blade with a fat sweet spot, built for hard tennis and leather alike.', feat: ['Hand-rolled willow', 'Convex spine profile', 'Leather PU grip', 'Toe guard fitted'] },
  Balls: { cat: 'cricket-kit', n: 4, suffix: 'Cricket Ball', sizes: BALL_SIZES, brands: ['Cosco', 'SG', 'MRF', 'DSC', 'Sports Hub'], names: ['Swing 6', 'Net Cracker', 'Club Stitch', 'Power Hit'], desc: 'Practice-grade stitched ball with durable cover and true, consistent bounce.', feat: ['Stitched seam', 'Durable cover', 'Training grade', 'Easy to mark'] },
  'Tennis Balls': { cat: 'cricket-kit', n: 4, suffix: 'Tennis Cricket Ball', sizes: BALL_SIZES, brands: ['Cosco', 'SG', 'MRF', 'DSC', 'Sports Hub'], names: ['Bounce', 'Court Pop', 'Street Spin', 'Match Training'], desc: 'Rubber tennis ball with a grippy seam — the gully-cricket favourite.', feat: ['Rubber core', 'Consistent bounce', 'High-grip seam'] },
  'Leather Balls': { cat: 'cricket-kit', n: 5, suffix: 'Leather Cricket Ball', sizes: BALL_SIZES, brands: ['Kookaburra', 'SG', 'SS', 'DSC', 'Sports Hub'], names: ['Match Red', 'Club Leather', 'Pro Scuff', 'Street Red', 'Academy Leather'], desc: 'Full-grain leather ball with a hand-stitched seam for match-standard swing.', feat: ['4-piece full-grain leather', 'Hand-stitched 76 threads', 'Weight 5.5 oz', 'Match seam'] },
  Pads: { cat: 'cricket-kit', n: 5, suffix: 'Batting Pads', sizes: EQUIP_SIZES, brands: ['SS', 'SG', 'MRF', 'BD', 'DSC', 'Sports Hub'], names: ['Swift EVA', 'Guardian Pro', 'Lite Flex', 'Power Shield', 'Tour Cane'], desc: 'EVA and cane pads with buckle straps and a split toe for fast footwork.', feat: ['High-density EVA foam', 'Buckle & strap fit', 'One-piece split toe', 'PVC wing guard'] },
  'Batting Gloves': { cat: 'cricket-kit', n: 5, suffix: 'Batting Gloves', sizes: EQUIP_SIZES, brands: ['MRF', 'SG', 'BD', 'SS', 'DSC'], names: ['Grip Pro', 'Ultra Soft', 'Flex Knuckle', 'Tour Guard', 'Ace Classic'], desc: 'Soft-palm batting gloves with flexible sidebars and a secure velcro strap.', feat: ['Soft-feel palm', 'Foam knuckle guard', 'Mesh back for airflow', 'Velcro closure'] },
  'Keeping Gloves': { cat: 'cricket-kit', n: 4, suffix: 'Keeping Gloves', sizes: EQUIP_SIZES, brands: ['SG', 'SS', 'BD', 'Sports Hub'], names: ['Catch Master', 'Soft Mould', 'Glove Classic', 'Youth Keeper'], desc: 'Concave-foam keeper gloves with pre-curved fingers for safe, clean catching.', feat: ['Concave foam moulding', 'Pre-curved fingers', 'Breathable mesh back'] },
  Helmets: { cat: 'cricket-kit', n: 5, suffix: 'Cricket Helmet', sizes: EQUIP_SIZES, brands: ['BD', 'SG', 'SS', 'MRF', 'DSC'], names: ['Sentry', 'Safe Guard', 'Pro Shell', 'Aero Grille', 'Titan Mask'], desc: 'Crash-absorbing helmet with a steel grille and adjustable backstrap for full protection.', feat: ['Impact-absorbing liner', 'Steel grille', 'Adjustable backstrap'] },
  Stumps: { cat: 'cricket-kit', n: 4, suffix: 'Stump Set', sizes: BALL_SIZES, brands: ['Cosco', 'SG', 'Sports Hub', 'DSC'], names: ['Post Set', 'Nylon Trio', 'Tour Stumps', 'Club Bails'], desc: 'Weatherproof stumps with bails, ready for the next local game.', feat: ['3 stumps + 2 bails', 'Weatherproof finish', 'Weighted base', 'Easy carry'] },
  'Box Guards': { cat: 'cricket-kit', n: 4, suffix: 'Abdominal Box Guard', sizes: ONE_SIZE, brands: ['SS', 'SG', 'BD', 'Sports Hub'], names: ['Shell Pro', 'Curve Guard', 'Impact Box', 'Junior Safe'], desc: 'Curved, impact-safe box guard with a breathable pouch for a snug fit.', feat: ['Impact-safe ABS shell', 'Breathable pouch', 'Ergonomic curve'] },
  'Thigh Pads': { cat: 'cricket-kit', n: 4, suffix: 'Thigh Guard', sizes: ONE_SIZE, brands: ['SG', 'SS', 'BD', 'Sports Hub'], names: ['EVA Shield', 'Flex Thigh', 'Comfort Pad', 'Hi-Top Guard'], desc: 'EVA shell thigh pad with comfort lining and an elastic belt.', feat: ['High-density EVA shell', 'Comfort liner', 'Elastic belt'] },
  'Arm Guards': { cat: 'cricket-kit', n: 4, suffix: 'Arm Guard', sizes: ['S', 'M', 'L'], brands: ['SS', 'SG', 'BD', 'Sports Hub'], names: ['Elbow Pro', 'Forearm Flex', 'Shell Guard', 'Soft Arm'], desc: 'Moulded-shell arm and elbow protection with adjustable elastic straps.', feat: ['Moulded PC shell', 'Comfort foam padding', 'Elastic strapping'] },
  'Chest Guards': { cat: 'cricket-kit', n: 4, suffix: 'Chest Guard', sizes: ONE_SIZE, brands: ['SG', 'SS', 'BD', 'Sports Hub'], names: ['Rib Shield', 'Chest Pro', 'Vent Guard', 'Impact Chest'], desc: 'Ventilated chest protection with EVA impact zones worn under the jersey.', feat: ['High-density EVA', 'Ventilated foam liner', 'Elastic clip straps'] },
  'Cricket Shoes': { cat: 'cricket-kit', n: 5, suffix: 'Cricket Shoes', sizes: SHOE_SIZES, brands: ['SS', 'BD', 'MRF', 'DSC', 'Sports Hub'], names: ['Grip Master', 'Accel Studs', 'Turf Pro', 'Zoom Spike', 'All Day'], desc: 'Studded cricket shoes with a cushioned footbed — stable at the crease, light in the field.', feat: ['Studded sole', 'Cushioned insole', 'Breathable upper', 'Reinforced toecap'] },
  'Sweatbands & Socks': { cat: 'cricket-kit', n: 4, suffix: 'Socks Pack', sizes: ['S', 'M', 'L', 'XL'], brands: ['Sports Hub', 'Nivia', 'Max Sports', 'Cosco'], names: ['Flex Sox', 'Grip Band', 'Breath Socks', 'Match Combo'], desc: 'Moisture-wicking socks and sweatband combo for hot match days.', feat: ['Moisture-wicking knit', 'Terry sole cushion', 'Comfort band'] },
  'Kit Bags': { cat: 'cricket-kit', n: 4, suffix: 'Cricket Kit Bag', sizes: BALL_SIZES, brands: ['SG', 'MRF', 'Sports Hub', 'BD'], names: ['Carry All', 'Wheel Tour', 'Bat Master', 'Club Duffel'], desc: 'Roomy kit bag with a bat sleeve, shoe pocket and heavy-duty zips.', feat: ['Internal bat sleeve', 'Separate shoe pocket', 'Heavy-duty zips'] },

  'T-Shirts': { cat: 'cricket-apparel', n: 5, suffix: 'T-Shirt', sizes: APPAREL_SIZES, brands: ['Sports Hub', 'Nivia', 'Max Sports', 'Mantra', 'SG Sports'], names: ['Pulse', 'Charge', 'Drift', 'Vertex', 'Stride'], desc: 'Combed-cotton training tee with a breathable, athletic fit.', feat: ['100% combed cotton', 'Regular athletic fit', 'Fade-resistant print'] },
  Shirts: { cat: 'cricket-apparel', n: 4, suffix: 'Collared Shirt', sizes: APPAREL_SIZES, brands: ['Max Sports', 'Nivia', 'Sports Hub', 'Mantra'], names: ['Aerolite', 'Collared Pro', 'Breeze', 'Match Fit'], desc: 'Quick-dry collared shirt for match days and practice sessions.', feat: ['Mesh quick-dry weave', 'Collared styling', 'Move-friendly cut'] },
  Lowers: { cat: 'cricket-apparel', n: 4, suffix: 'Track Lower', sizes: APPAREL_SIZES, brands: ['Sports Hub', 'Nivia', 'Max Sports', 'Mantra'], names: ['Flex Track', 'Pro Stretch', 'Game Lower', 'Comfort Zip'], desc: '4-way stretch track lower with deep pockets and a drawcord waist.', feat: ['4-way stretch', 'Two deep pockets', 'Drawcord waist'] },
  Jerseys: { cat: 'cricket-apparel', n: 5, suffix: 'Team Jersey', sizes: APPAREL_SIZES, brands: ['Sports Hub', 'Nivia', 'Max Sports', 'Mantra', 'SG Sports'], names: ['Aces', 'Blaze', 'Faith', 'Rally', 'Tempo'], desc: 'Sublimation-ready matchday jersey — team name, number and sponsor printable.', feat: ['Sublimation fabric', 'Slim athletic cut', 'Print-ready panels'] },

  Football: { cat: 'other-sports', n: 4, suffix: 'Football', sizes: BALL_SIZES, brands: ['Cosco', 'Nivia', 'Vector X', 'Sports Hub'], names: ['Premier', 'Street 5', 'Goal Master', 'Turf Ball'], desc: 'Machine-stitched TPU football tuned for grass and hard ground.', feat: ['TPU outer casing', 'Machine-stitched panels', 'Butyl bladder'] },
  Badminton: { cat: 'other-sports', n: 4, suffix: 'Racket', sizes: BALL_SIZES, brands: ['Yonex', 'Apacs', 'Cosco', 'Lining'], names: ['Smash X', 'Rally Lite', 'Net King', 'Court Ace'], desc: 'Lightweight aluminium racket with a shock-absorbing grip.', feat: ['Aluminium frame', 'Strung head', 'Comfort grip'] },
  Basketball: { cat: 'other-sports', n: 4, suffix: 'Basketball', sizes: BALL_SIZES, brands: ['Cosco', 'Nivia', 'Vector X', 'Sports Hub'], names: ['Dunk Pro', 'Street Ball', 'Court King', 'Hoop Master'], desc: 'Rubberised composite basketball with deep channels for outdoor courts.', feat: ['Composite rubber', 'Deep channel grip', 'Size 7 (men)'] },
}

const generatedCatalog = () => {
  const out = []
  for (const sub of Object.keys(G)) {
    const s = G[sub]
    const [lo, hi] = PRICE[sub]
    const pal = s.cat === 'cricket-apparel' ? APP_PAL : s.cat === 'other-sports' ? OTH_PAL : KIT_PAL
    for (let k = 0; k < s.n; k++) {
      const i = out.length
      const brand = s.brands[i % s.brands.length]
      const name = `${brand} ${s.names[i % s.names.length]} ${s.suffix}`
      const mrp = priceOf(lo, hi, i)
      const price = Math.max(149, Math.round((mrp * (72 + ri(i, 12))) / 100 / 5) * 5)
      const mkBestseller = i % 9 === 0
      const mkNew = !mkBestseller && i % 7 === 0
      const mkFeatured = !mkBestseller && !mkNew && i % 13 === 0
      out.push(
        P({
          id: `p1${String(i).padStart(2, '0')}`,
          slug: name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name,
          brand,
          category: s.cat,
          subcategory: sub,
          price,
          mrp,
          stock: i % 23 === 0 ? (i % 2 === 0 ? 0 : 2) : (i * 7) % 41 + 4,
          sizes: s.sizes,
          description: `${s.desc} The ${name} is ready for pickup in store or COD delivery in Purnea.`,
          features: s.feat,
          bestseller: mkBestseller,
          featured: mkFeatured,
          isNew: mkNew,
          badge: mkNew ? 'New' : null,
          createdAt: d(2025, (i % 11) + 1, (i * 5) % 27 + 1),
          gradient: pal[i % pal.length],
        }),
      )
    }
  }
  return out
}

export const products = [...seedCatalog, ...generatedCatalog()]

export const getCategories = () => categories

/* --- persisted catalog (admin edits live-persist here) --- */
const CATALOG_KEY = 'sh:catalog:v3'
export const getCatalog = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY)
    return raw ? JSON.parse(raw) : products
  } catch {
    return products
  }
}
export const saveCatalog = (list) => localStorage.setItem(CATALOG_KEY, JSON.stringify(list))
export const resetCatalog = () => localStorage.removeItem(CATALOG_KEY)

export const getProducts = () => getCatalog()
export const getProduct = (idOrSlug) =>
  getCatalog().find((p) => p.id === idOrSlug || p.slug === idOrSlug)

export const featuredProducts = () => getCatalog().filter((p) => p.featured)
export const bestsellerProducts = () => getCatalog().filter((p) => p.bestseller || p.badge === 'Bestseller')
export const newArrivals = () =>
  [...getCatalog()].filter((p) => p.isNew).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export const searchProducts = (q) => {
  const t = (q || '').trim().toLowerCase()
  if (!t) return []
  return getCatalog().filter((p) => {
    const hay = [p.name, p.brand, p.subcategory, p.categoryName, ...(p.tags || [])].join(' ').toLowerCase()
    return hay.includes(t)
  })
}

export const brands = () => [...new Set(getCatalog().map((p) => p.brand))].sort()
export const subcategoriesFor = (category) => categories.find((c) => c.slug === category)?.subcategories || []