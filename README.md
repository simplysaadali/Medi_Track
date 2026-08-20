# MediTrack — Clinic Appointment Portal

Lightweight clinic appointment demo app (patient/staff) with auth, cookies, and a React + Redux frontend.

Tech stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT stored in an HttpOnly cookie
- **Frontend:** React, Vite, React Router, Redux Toolkit, Axios
- **Dev tools:** nodemon (server), Vite (client)

Status
- Basic authentication, appointment CRUD, and staff panel implemented. Logout, protected routes, and cookie-based auth are active.

Getting started

1) Backend

```bash
cd server
npm install
cp .env.example .env   # Windows: copy .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET (use a long random string)
npm run dev
```

The API defaults to http://localhost:5000. Health check: http://localhost:5000/api/health

2) Frontend

```bash
cd client
npm install
npm run dev
```

The client defaults to http://localhost:5173 (Vite).

Notes on cookies and CORS
- The client `axios` instance uses `withCredentials: true` so the browser will send cookies.
- The server sets `cors({ origin: process.env.CLIENT_URL, credentials: true })` and uses `cookie-parser`.

Environment variables (`server/.env`)
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — long random secret for signing tokens
- `PORT` — optional (defaults to 5000)

Quick API map
- `POST /api/auth/register` — register and set cookie
- `POST /api/auth/login` — login and set cookie
- `GET /api/auth/me` — returns current user (requires cookie)
- `POST /api/auth/logout` — clears cookie
- `GET/POST /api/appointments` — patient: list/create own appointments
- `DELETE /api/appointments/:id` — cancel own appointment
- `GET /api/staff/appointments` — staff-only: view all appointments
- `PATCH /api/staff/appointments/:id/status` — staff-only: update status

File structure (top-level)

- `client/` — React app
	- `src/` — source code
		- `api/axios.js` — axios instance (withCredentials)
		- `app/store.js` — redux store
		- `components/Navbar.jsx` — top nav (login/logout links)
		- `features/appointments/` — `appointmentsSlice.js`, `Dashboard.jsx`, `StaffPanel.jsx`
		- `features/auth/` — `authSlice.js`, `LoginForm.jsx`, `RegisterForm.jsx`, password flows
		- `routes/ProtectedRoute.jsx`, `RoleRoute.jsx`

- `server/` — Express API
	- `routes/auth.js` — register/login/me/logout
	- `routes/appointments.js` — appointment endpoints
	- `routes/staff.js` — staff-only endpoints
	- `middleware/auth.js` — cookie jwt protect middleware
	- `models/User.js`, `models/Appointment.js`

How to use the app (basic)
- Register as a patient from the UI.
- The server sets an HttpOnly cookie containing the JWT. The frontend calls `GET /api/auth/me` to populate user state.
- Access `My appointments` to view, create, or cancel appointment requests.
- To test staff features, set the user's `role` to `staff` in the database (manual change) and sign in.

Testing logout (quick)

Server running on port 5000:

```bash
curl -i -X POST http://localhost:5000/api/auth/logout
```

Or click the `Log out` button in the UI — it dispatches `logoutUser()` which posts to `/api/auth/logout` and clears frontend state.

Why this structure and benefits
- Cookie-based JWT (HttpOnly) reduces risk of token theft via XSS compared to localStorage.
- Clear separation of responsibilities: the backend handles auth and data rules; the frontend handles presentation and local state.
- Redux Toolkit keeps async flows and state predictable.

Real-world usage examples
- Small clinics that need appointment requests and staff scheduling.
- Prototype for an EMR front-end where auth and role-based access are required.

Possible improvements
- Add refresh tokens / short-lived access tokens for stronger security.
- Email notifications for appointment confirmations / cancellations.
- Pagination and filtering on appointment lists.

Contributing
- Fixes or improvements: fork, branch, PR. Keep `.env` out of commits.

License
- No license specified — add one if you plan to share publicly.

If you want, I can also:
- Add a small test script that runs a few API smoke tests, or
- Create a short developer checklist or docker-compose for easier local runs.

---

