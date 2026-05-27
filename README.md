# Jb Pest Control — Full-Stack Website

Premium, fully responsive website for Jb Pest Control, Brakpan.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** SQLite (via better-sqlite3)
- **Auth:** JWT + bcrypt
- **File Uploads:** Multer

---

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Start the Backend

```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 4. Start the Frontend

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Admin Login

URL: `http://localhost:5173/admin/login`

- **Email:** admin@jbpestcontrol.co.za
- **Password:** Admin123!

To change the admin password, update the seed in `server/db/database.js` and delete `server/db/jbpestcontrol.db` to re-seed.

---

## Admin Dashboard Features

| Section | Features |
|---|---|
| Dashboard | Stats overview, recent bookings |
| Bookings | View, filter, update status, add notes, delete |
| Services | Add, edit, delete, toggle active |
| Content | Edit hero text, about, contact info, WhatsApp message |
| Gallery | Upload images, edit metadata, delete |
| Testimonials | Add, edit, delete, toggle active |

---

## WhatsApp Integration

- **Number:** +27 71 949 5929
- **Default link:** `https://wa.me/27719495929?text=...`
- Floating WhatsApp button on all pages
- Service-specific WhatsApp enquiry buttons
- Booking form includes WhatsApp confirmation option
- After booking: "Send Booking via WhatsApp" with pre-filled details

---

## Environment Variables

**server/.env:**
```
PORT=5000
JWT_SECRET=your_secure_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## File Structure

```
JbPestControl/
├── server/                    # Express API
│   ├── db/database.js         # SQLite setup + seed
│   ├── middleware/auth.js     # JWT middleware
│   ├── middleware/upload.js   # Multer config
│   ├── routes/                # All API routes
│   ├── uploads/               # Uploaded images
│   └── server.js
└── client/                    # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── layout/        # Header, Footer, FloatingWhatsApp
    │   │   └── home/          # All home page sections
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── admin/         # Dashboard + CRUD pages
    │   ├── context/AuthContext.jsx
    │   ├── utils/api.js
    │   └── utils/whatsapp.js
    └── index.html             # SEO + schema markup
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | No | Admin login |
| GET | /api/auth/verify | Yes | Verify token |
| POST | /api/bookings | No | Submit booking |
| GET | /api/bookings | Yes | List all bookings |
| PUT | /api/bookings/:id | Yes | Update booking |
| DELETE | /api/bookings/:id | Yes | Delete booking |
| GET | /api/services | No | List active services |
| POST | /api/services | Yes | Create service |
| PUT | /api/services/:id | Yes | Update service |
| DELETE | /api/services/:id | Yes | Delete service |
| GET | /api/content | No | Get all site content |
| PUT | /api/content/:key | Yes | Update content item |
| POST | /api/contact | No | Submit contact form |
| GET | /api/gallery | No | List gallery images |
| POST | /api/gallery | Yes | Upload image |
| GET | /api/testimonials | No | List active testimonials |
| POST | /api/testimonials | Yes | Create testimonial |
| GET | /api/dashboard/stats | Yes | Dashboard statistics |

---

## Deployment Notes

1. Set a strong `JWT_SECRET` in production
2. Update `CLIENT_URL` in `.env` to your production domain
3. Configure a reverse proxy (Nginx) to serve both API and static files
4. For production builds: `cd client && npm run build`
5. Serve the `client/dist` folder with your web server or Express static middleware
