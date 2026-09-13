# EventHub — Frontend

React + Tailwind frontend for an event management & ticket booking platform.
Built to match this backend feature set:

- JWT auth (register / login), role-based access (user / admin)
- Event CRUD, category CRUD, image upload
- Search, category filter, ordering, pagination on the events list
- Ticket booking with a max-per-booking limit, seat count decreases/increases automatically
- Booking history for users; full booking management for admins

## Stack

- React 18 (JavaScript, no TypeScript) + Vite
- Tailwind CSS
- React Router v6
- Axios (JWT attached via interceptor)
- React Context API for auth state — no Redux

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

## Folder structure

```
src/
  api/            axios instance + one file per resource (auth, events, categories, bookings)
  components/     shared building blocks (Navbar, EventCard, Modal, Pagination, ...)
  context/         AuthContext (session, login/register/logout, role)
  hooks/          useAuth, useEvents, useDebounce
  pages/          public pages (Events, EventDetail, Login, Register, MyBookings)
  pages/admin/    admin console pages (Dashboard, ManageEvents, ManageCategories, ManageBookings)
  routes/         ProtectedRoute (auth + role gating)
```

## Expected API contract

The frontend assumes a REST API shaped like this (adjust `src/api/*.js` if yours differs):

| Action | Method & path |
| --- | --- |
| Register | `POST /auth/register/` |
| Login | `POST /auth/login/` |
| Admin login | `POST /auth/admin-login/` |
| Profile | `GET /auth/profile/` |
| List events | `GET /events/?search=&category=&ordering=&page=&page_size=` |
| Event detail | `GET /events/:id/` |
| Create/update event | `POST/PATCH /events/` (multipart, supports `image`) |
| Delete event | `DELETE /events/:id/` |
| List/create/update/delete categories | `/categories/` |
| Create booking | `POST /bookings/` — `{ event, quantity }` |
| My bookings | `GET /bookings/my/` |
| Cancel booking | `POST /bookings/:id/cancel/` |
| All bookings (admin) | `GET /bookings/?status=&page=` |
| Update booking (admin) | `PATCH /bookings/:id/` |

Auth responses are expected to return `{ access, user: { id, email, role, ... } }`. `user.role` of `"admin"`
is what unlocks the `/admin/*` routes — everything else is treated as a regular user.

## Notes

- Max tickets per booking is set in `src/pages/EventDetail.jsx` (`MAX_TICKETS_PER_BOOKING`, currently 6) —
  the backend should enforce the same limit server-side.
- The 401 interceptor in `src/api/axios.js` clears the session and bounces to `/login` — swap in a
  refresh-token flow there if your backend issues one.
