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
    property_type TEXT NOT NULL,
    pest_problem TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    urgency TEXT DEFAULT 'normal',
    message TEXT,
    status TEXT DEFAULT 'new',
    internal_notes TEXT,
    whatsapp_sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    icon TEXT,
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
`);

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
    { name: 'Cockroach Control', slug: 'cockroach-control', description: 'Professional cockroach elimination for homes and businesses. Fast, effective treatment that targets cockroaches at the source for lasting results.', icon: 'Bug', display_order: 1 },
    { name: 'Ant Control', slug: 'ant-control', description: 'Comprehensive ant control solutions. We identify the species and apply targeted treatments to eliminate entire ant colonies quickly.', icon: 'Zap', display_order: 2 },
    { name: 'Rodent & Rat Control', slug: 'rodent-rat-control', description: 'Effective rodent control for rats and mice. We seal entry points and apply professional baiting and trapping solutions to keep rodents out.', icon: 'Shield', display_order: 3 },
    { name: 'Termite Treatment', slug: 'termite-treatment', description: 'Protect your property from costly termite damage. Professional termite inspection and barrier treatment services for homes and buildings.', icon: 'AlertTriangle', display_order: 4 },
    { name: 'Bed Bug Treatment', slug: 'bed-bug-treatment', description: 'Complete bed bug elimination using professional heat and chemical treatments. We treat all affected areas to ensure total removal and prevent reinfestation.', icon: 'Moon', display_order: 5 },
    { name: 'Flea Treatment', slug: 'flea-treatment', description: 'Fast and effective flea treatments for homes and properties. Safe for families and pets once dry. Treats all life cycle stages for lasting results.', icon: 'Sparkles', display_order: 6 },
    { name: 'Spider Control', slug: 'spider-control', description: 'Targeted spider control treatments. We remove webs and apply residual treatments to all entry points and harborage areas to keep spiders away.', icon: 'Circle', display_order: 7 },
    { name: 'General Pest Control', slug: 'general-pest-control', description: 'Comprehensive general pest control covering a wide range of common household and commercial pests with one thorough treatment visit.', icon: 'Crosshair', display_order: 8 },
    { name: 'Residential Pest Control', slug: 'residential-pest-control', description: 'Tailored pest control solutions for homes and residential properties. Keep your family safe with professional once-off or regular maintenance treatments.', icon: 'Home', display_order: 9 },
    { name: 'Commercial Pest Control', slug: 'commercial-pest-control', description: 'Professional pest control for businesses, warehouses, restaurants, offices, and all commercial properties. Discreet, effective, and fully documented.', icon: 'Building2', display_order: 10 },
  ];
  const insertService = db.prepare('INSERT INTO services (name, slug, description, icon, display_order) VALUES (?, ?, ?, ?, ?)');
  services.forEach(s => insertService.run(s.name, s.slug, s.description, s.icon, s.display_order));
}

const contentCount = db.prepare('SELECT COUNT(*) as count FROM content').get();
if (contentCount.count === 0) {
  const contentItems = [
    { key: 'hero_headline', value: 'Professional Pest Control in Brakpan — Available 24/7' },
    { key: 'hero_subheadline', value: 'Fast, safe, and reliable pest control for homes and businesses in Brakpan and surrounding areas. We eliminate pests quickly and professionally so you can have complete peace of mind.' },
    { key: 'about_text', value: 'Sp Pest Control provides reliable, professional pest control services across Brakpan and the surrounding areas. We understand how stressful pest problems can be — whether it\'s cockroaches in your kitchen, rodents in your walls, or termites threatening your property.\n\nOur experienced team uses safe, effective treatments to eliminate pests quickly and professionally. We take pride in our fast response times, our attention to detail, and our commitment to customer satisfaction.\n\nEvery home and business is different, which is why we tailor our pest control solutions to your specific needs. From once-off treatments to ongoing pest management contracts, we are here to help you maintain a clean, safe, and pest-free environment. With Sp Pest Control, you deal directly with a knowledgeable local team that genuinely cares about delivering results. We are available 24 hours a day for urgent pest control needs across Brakpan and surrounding areas.' },
    { key: 'whatsapp_message', value: 'Hi Sp Pest Control, I would like to book a pest control service. Please contact me.' },
    { key: 'cta_primary', value: 'Book Pest Control' },
    { key: 'cta_secondary', value: 'Call 071 949 5929' },
    { key: 'operating_hours', value: 'Open 24 Hours' },
    { key: 'phone', value: '071 949 5929' },
    { key: 'whatsapp_number', value: '27719495929' },
    { key: 'address', value: '7527 Jumba Street, Brakpan, 1520, South Africa' },
    { key: 'service_area', value: 'Brakpan and surrounding areas' },
  ];
  const insertContent = db.prepare('INSERT INTO content (key, value) VALUES (?, ?)');
  contentItems.forEach(c => insertContent.run(c.key, c.value));
}

const testimonialCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
if (testimonialCount.count === 0) {
  const testimonials = [
    { name: 'Thabo Nkosi', location: 'Brakpan', rating: 5, review: 'Excellent service! Sp Pest Control responded within hours and completely sorted out our cockroach problem. Very professional and thorough. Highly recommend to anyone in Brakpan.' },
    { name: 'Sarah van der Merwe', location: 'Springs', rating: 5, review: 'We had a serious rodent problem in our warehouse. Sp Pest Control came out quickly, sealed all the entry points, and the problem was resolved completely. Great work and fair pricing.' },
    { name: 'Priya Naidoo', location: 'Brakpan East', rating: 5, review: 'Called them late at night for an urgent bed bug issue. They were available and came out the next morning. Very thorough treatment and excellent communication throughout. Will definitely use again.' },
  ];
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, location, rating, review) VALUES (?, ?, ?, ?)');
  testimonials.forEach(t => insertTestimonial.run(t.name, t.location, t.rating, t.review));
}

module.exports = db;
