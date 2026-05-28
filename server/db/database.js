const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'jbpestcontrol.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    customer_type TEXT NOT NULL,
    service_category TEXT,
    pest_problem TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    urgency TEXT DEFAULT 'normal',
    message TEXT,
    status TEXT DEFAULT 'new',
    internal_notes TEXT,
    whatsapp_sent INTEGER DEFAULT 0,
    payment_option TEXT DEFAULT 'quote_first',
    payment_status TEXT DEFAULT 'not_applicable',
    total_amount REAL,
    payment_reference TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    icon TEXT,
    category TEXT DEFAULT 'both',
    active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    title TEXT,
    alt_text TEXT,
    featured INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER DEFAULT 5,
    review TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS protection_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    frequency TEXT,
    monthly_price REAL DEFAULT 0,
    included_visits INTEGER DEFAULT 0,
    extra_callout_cost REAL DEFAULT 0,
    features TEXT,
    terms TEXT,
    highlight INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS industries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    common_pests TEXT,
    icon TEXT,
    cta_text TEXT DEFAULT 'Request Industry Plan',
    active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    gateway TEXT NOT NULL DEFAULT 'payfast',
    payment_type TEXT NOT NULL DEFAULT 'once_off',
    status TEXT DEFAULT 'pending',
    gateway_reference TEXT,
    gateway_data TEXT,
    pf_payment_id TEXT,
    merchant_reference TEXT UNIQUE NOT NULL,
    item_name TEXT,
    item_description TEXT,
    name_first TEXT,
    name_last TEXT,
    email_address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS plan_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    plan_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    plan_name TEXT,
    status TEXT DEFAULT 'enquiry',
    payment_method TEXT DEFAULT 'manual',
    start_date TEXT,
    next_billing_date TEXT,
    monthly_amount REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Add new columns to existing bookings table (safe no-op if already present)
['payment_option TEXT DEFAULT \'quote_first\'', 'payment_status TEXT DEFAULT \'not_applicable\'', 'total_amount REAL', 'payment_reference TEXT'].forEach(col => {
  try { db.exec(`ALTER TABLE bookings ADD COLUMN ${col}`) } catch (_) {}
});

const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@sppestcontrol.co.za');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('Admin123!', 10);
  db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(
    'admin@sppestcontrol.co.za',
    hashedPassword,
    'Admin'
  );
}

const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
if (serviceCount.count === 0) {
  const services = [
    { name: 'Cockroach Control', slug: 'cockroach-control', description: 'Professional cockroach elimination using targeted gel formulations and specialised treatments to stop infestations at the source. Effective for homes, kitchens, and commercial premises.', icon: 'Bug', category: 'both', display_order: 1 },
    { name: 'Ant Control', slug: 'ant-control', description: 'Effective ant control that targets the colony at the source using professional-grade treatments. We identify the species and apply the right solution where DIY sprays simply fail.', icon: 'Zap', category: 'both', display_order: 2 },
    { name: 'Rodent Control', slug: 'rodent-control', description: 'Complete rodent management including professional baiting, trapping, and exclusion services to stop rats and mice from entering and living on your property.', icon: 'Shield', category: 'both', display_order: 3 },
    { name: 'Termite Treatment', slug: 'termite-treatment', description: 'Targeted termite treatments to protect your property from costly structural damage. Professional inspection and barrier treatment for homes and commercial buildings.', icon: 'AlertTriangle', category: 'both', display_order: 4 },
    { name: 'Bed Bug Treatment', slug: 'bed-bug-treatment', description: 'Thorough bed bug elimination using professional methods that go beyond surface-level spraying. We treat all affected areas for complete eradication and to help prevent reinfestation.', icon: 'Moon', category: 'both', display_order: 5 },
    { name: 'Flea & Tick Treatment', slug: 'flea-treatment', description: 'Professional flea and tick control for homes with pets, treating both interior and exterior areas for lasting relief. Safe once dry and effective against all life cycle stages.', icon: 'Sparkles', category: 'residential', display_order: 6 },
    { name: 'Spider Control', slug: 'spider-control', description: 'Safe and effective spider control treatments targeting web-spinning and burrowing spiders in and around your property, including removal of webs and residual treatment.', icon: 'Circle', category: 'residential', display_order: 7 },
    { name: 'Wasp Control', slug: 'wasp-control', description: 'Safe removal and treatment of wasp nests from your property, protecting your family and customers from painful and potentially dangerous stings.', icon: 'Crosshair', category: 'both', display_order: 8 },
    { name: 'Bee Removal', slug: 'bee-removal', description: 'Responsible bee removal and relocation services, protecting these important pollinators where possible while keeping your property safe and accessible.', icon: 'Home', category: 'both', display_order: 9 },
    { name: 'Fly Control', slug: 'fly-control', description: 'Professional fly control solutions for commercial kitchens, restaurants, and businesses, including fly unit installation, drain treatments, and integrated fly management programmes.', icon: 'Zap', category: 'commercial', display_order: 10 },
    { name: 'Silverfish Control', slug: 'silverfish-control', description: 'Targeted silverfish treatments to protect books, papers, clothing, and stored food in your home from these destructive and fast-breeding pests.', icon: 'Sparkles', category: 'residential', display_order: 11 },
    { name: 'Bird & Pigeon Proofing', slug: 'bird-pigeon-proofing', description: 'Professional bird deterrent and proofing solutions to prevent pigeons and other birds from nesting, roosting, and causing damage on your property.', icon: 'Shield', category: 'both', display_order: 12 },
    { name: 'General Pest Control', slug: 'general-pest-control', description: 'Comprehensive general pest control treatment covering multiple common pest species in a single professional service visit. Ideal for routine maintenance and new infestations.', icon: 'Crosshair', category: 'both', display_order: 13 },
    { name: 'Commercial Pest Control', slug: 'commercial-pest-control', description: 'Professional pest management programmes for businesses, restaurants, schools, retail spaces, warehouses, and all commercial properties. Discreet, documented, and effective.', icon: 'Building2', category: 'commercial', display_order: 14 },
  ];
  const insertService = db.prepare('INSERT INTO services (name, slug, description, icon, category, display_order) VALUES (?, ?, ?, ?, ?, ?)');
  services.forEach(s => insertService.run(s.name, s.slug, s.description, s.icon, s.category, s.display_order));
}

const contentCount = db.prepare('SELECT COUNT(*) as count FROM content').get();
if (contentCount.count === 0) {
  const contentItems = [
    { key: 'hero_headline', value: 'Professional Pest Control for Homes & Businesses' },
    { key: 'hero_subheadline', value: 'SP Pest Control provides reliable residential and commercial pest control solutions designed to stop infestations fast and help prevent them from coming back.' },
    { key: 'about_text', value: 'SP Pest Control provides professional pest control services for homes and businesses. We understand how disruptive pest problems can be — whether cockroaches in your kitchen, rodents in your walls, or termites threatening your property structure.\n\nOur experienced team uses safe, effective treatments to eliminate pests quickly and professionally. We take pride in fast response times, attention to detail, and a genuine commitment to customer satisfaction.\n\nFrom once-off treatments to ongoing pest management programmes, we help you maintain a clean, safe, and pest-free environment. With SP Pest Control, you work directly with a knowledgeable team that treats every job as urgent.' },
    { key: 'whatsapp_message', value: 'Hi SP Pest Control, I would like to enquire about pest control services. Please contact me.' },
    { key: 'cta_primary', value: 'Book Pest Control' },
    { key: 'cta_secondary', value: 'WhatsApp Us' },
    { key: 'operating_hours', value: 'Available 24/7' },
    { key: 'phone', value: 'Add phone number' },
    { key: 'whatsapp_number', value: '27608117897' },
    { key: 'address', value: 'Add business address' },
    { key: 'email', value: 'Add email address' },
    { key: 'service_area', value: 'Residential & Commercial' },
  ];
  const insertContent = db.prepare('INSERT INTO content (key, value) VALUES (?, ?)');
  contentItems.forEach(c => insertContent.run(c.key, c.value));
}

const testimonialCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
if (testimonialCount.count === 0) {
  const testimonials = [
    { name: 'Sarah Mitchell', location: 'Residential Client', rating: 5, review: 'SP Pest Control responded quickly and completely resolved our cockroach problem. The technician was professional, thorough, and took the time to explain the treatment process. Highly recommend their service.' },
    { name: 'David Roets', location: 'Commercial Client', rating: 5, review: 'We use SP Pest Control for our warehouse and have been impressed from day one. Reliable, discreet, and effective. The reporting after each visit is a bonus for our compliance requirements.' },
    { name: 'Priya Naidoo', location: 'Residential Client', rating: 5, review: 'Called them for an urgent bed bug issue and they were available the following morning. Very thorough treatment, excellent communication throughout, and the problem was resolved completely.' },
  ];
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, location, rating, review) VALUES (?, ?, ?, ?)');
  testimonials.forEach(t => insertTestimonial.run(t.name, t.location, t.rating, t.review));
}

const planCount = db.prepare('SELECT COUNT(*) as count FROM protection_plans').get();
if (planCount.count === 0) {
  const plans = [
    {
      name: 'RatGuard Monthly',
      slug: 'ratguard-monthly',
      tagline: 'Proactive rat protection for your home',
      description: 'Keeping your home safe from rodents should not be a DIY headache. RatGuard Monthly provides a proactive, professional perimeter of protection to help keep rats outside where they belong.',
      frequency: 'Monthly — 1 visit per month',
      monthly_price: 260.00,
      included_visits: 1,
      extra_callout_cost: 0,
      features: '["Professional installation of 4 tamper-resistant bait stations","Strategic placement around the property","Monthly technician visit","Station inspection and monitoring","Professional-grade bait replenishment","Monitoring for new rodent activity","Tamper-resistant safety-focused stations","Detailed reporting after every visit"]',
      terms: 'Monthly billing at R260.00 inclusive of 15% VAT. No hidden refill fees. 30 days notice required for cancellation.',
      highlight: 0,
      active: 1,
      display_order: 1,
    },
    {
      name: 'RoachGuard 360',
      slug: 'roachguard-360',
      tagline: 'Year-round cockroach protection',
      description: 'Do not wait for an infestation to take over your kitchen. RoachGuard 360 provides year-round cockroach protection and peace of mind. Instead of simply spraying and hoping, this plan helps manage the pest lifecycle so cockroaches do not keep coming back.',
      frequency: 'Monthly subscription — 4 treatments per year',
      monthly_price: 120.00,
      included_visits: 4,
      extra_callout_cost: 120.00,
      features: '["4 professional cockroach treatments per year","One treatment every 3 months","Designed to break the breeding cycle","Professional-grade gels and targeted sprays","Member rate for extra top-up treatments","Budget-friendly monthly subscription","Proactive instead of reactive"]',
      terms: 'Monthly billing at R120.00. Service interval: one treatment every 90 days. Additional treatments available at R120.00 per visit. 30 days notice required for cancellation.',
      highlight: 1,
      active: 1,
      display_order: 2,
    },
    {
      name: 'AntArmor 365',
      slug: 'antarmor-365',
      tagline: 'Year-round ant barrier protection',
      description: 'Stop playing whack-a-mole with sugar ants. Most DIY sprays scatter the colony and make the problem worse. AntArmor 365 is a year-round subscription designed to target the source and create a long-lasting barrier around your home.',
      frequency: 'Monthly subscription — 2 treatments per year',
      monthly_price: 156.00,
      included_visits: 2,
      extra_callout_cost: 150.00,
      features: '["Bi-annual deep treatment — spring and summer","Non-repellent transfer technology","Exterior perimeter shielding","Treatment around foundations and entry points","Garden colony mapping and active nest identification","Priority emergency member rate","Pet and family conscious treatment approach","Save R648 per year vs single treatments"]',
      terms: 'Monthly subscription at R156.00. Duration: 12-month commitment. Includes 2 scheduled treatments per year. Extra call-outs available at R150.00. Easy monthly billing.',
      highlight: 0,
      active: 1,
      display_order: 3,
    },
  ];
  const insertPlan = db.prepare(`
    INSERT INTO protection_plans (name, slug, tagline, description, frequency, monthly_price, included_visits, extra_callout_cost, features, terms, highlight, active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  plans.forEach(p => insertPlan.run(p.name, p.slug, p.tagline, p.description, p.frequency, p.monthly_price, p.included_visits, p.extra_callout_cost, p.features, p.terms, p.highlight, p.active, p.display_order));
}

const industryCount = db.prepare('SELECT COUNT(*) as count FROM industries').get();
if (industryCount.count === 0) {
  const industries = [
    {
      name: 'Multi-Family Housing',
      slug: 'multi-family-housing',
      description: 'In multi-unit properties like apartments and town home communities, a pest problem in one unit can quickly spread to neighbouring units. SP Pest Control helps property managers stay ahead of pest issues with reliable service, fast response times, and proactive communication.',
      common_pests: '["Rodents","Ants","Cockroaches","Flies","Termites"]',
      icon: 'Building2',
      cta_text: 'Request a Multi-Family Plan',
      active: 1,
      display_order: 1,
    },
    {
      name: 'Restaurants & Food Services',
      slug: 'restaurants-food-services',
      description: 'In food service, reputation is everything. Whether it is a fast-casual restaurant, commercial kitchen, cafeteria, or fine dining establishment, keeping pests out is essential for food safety, regulatory compliance, and customer trust.',
      common_pests: '["Rodents","Ants","Cockroaches","Flies","Termites"]',
      icon: 'Utensils',
      cta_text: 'Request a Restaurant Plan',
      active: 1,
      display_order: 2,
    },
    {
      name: 'Retail Businesses',
      slug: 'retail-businesses',
      description: 'In retail, first impressions matter. Customers expect a clean, safe, and inviting environment. SP Pest Control offers discreet, effective pest management services that help protect your store, your brand, and your bottom line.',
      common_pests: '["Rodents","Ants","Cockroaches","Flies","Termites"]',
      icon: 'ShoppingBag',
      cta_text: 'Request a Retail Plan',
      active: 1,
      display_order: 3,
    },
    {
      name: 'Schools & Educational Facilities',
      slug: 'schools-educational-facilities',
      description: 'In schools, learning should be the only thing that is buzzing. SP Pest Control provides pest control solutions designed to be effective, discreet, and suitable for sensitive educational environments including preschools, public schools, and campuses.',
      common_pests: '["Rodents","Ants","Cockroaches","Flies","Termites"]',
      icon: 'GraduationCap',
      cta_text: 'Request a School Plan',
      active: 1,
      display_order: 4,
    },
  ];
  const insertIndustry = db.prepare(`
    INSERT INTO industries (name, slug, description, common_pests, icon, cta_text, active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  industries.forEach(i => insertIndustry.run(i.name, i.slug, i.description, i.common_pests, i.icon, i.cta_text, i.active, i.display_order));
}

module.exports = db;
