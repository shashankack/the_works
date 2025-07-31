# 🧾 Frontend TODO — Gym & Events Admin Panel

## ✅ 0. Core Setup (DONE)
- [x] Axios instance with token interceptor (`utils/axiosInstance.js`)
- [x] Auth context and token helpers (`context/AuthContext.jsx`, `utils/auth.js`)
- [x] Admin-only routes using `AdminLayout.jsx` + `<Outlet />`
- [x] LocalStorage-based login state
- [x] Protected routes with redirect

---

## 🔐 1. Auth Logic
- [ ] ✅ Redirect authenticated user away from `/admin/login`
- [ ] ⛔ Redirect unauthenticated user from `/admin/*` to `/admin/login`
- [ ] 🧪 Add `useAuth().isAuthenticated()` wherever needed
- [ ] 🎨 Add loading state during auth check

---

## 📊 2. Admin Dashboard (`/admin/dashboard`)
- [x] Admin route + layout setup
- [ ] Dashboard cards:
  - [ ] Total Bookings
  - [ ] Confirmed / Pending
  - [ ] Total Users
  - [ ] Total Revenue
- [ ] Add backend call to `/api/admin/stats`
- [ ] Loading + error fallback
- [ ] Style dashboard with MUI + theme palette

---

## 🧾 3. Bookings Table (`/admin/bookings`)
- [ ] Paginated + filterable bookings list
- [ ] Status badge (pending / confirmed / cancelled)
- [ ] Actions: Change status, view addons
- [ ] Search by user name or class
- [ ] UPI Txn ID display
- [ ] Add sorting (by date / class / user)

---

## 🧩 4. Addons UI
- [ ] View attached addons per booking
- [ ] Attach addons to a booking (`/api/bookings/:id/addons`)
- [ ] Modal: show all available addons
- [ ] Filter by class or event
- [ ] UI feedback (success / error toast)

---

## 🧍 5. Attendance UI
- [ ] Mark attendance from admin panel
- [ ] Status: Present / Absent / Cancelled
- [ ] Linked to class or event
- [ ] Bulk mark attendance for session

---

## 🧑‍🏫 6. Trainers CRUD
- [ ] Table of trainers
- [ ] Create + Edit form (photo URL + name)
- [ ] Delete with confirmation
- [ ] Use `/api/trainers` endpoints

---

## 🎉 7. Events Page (`/admin/events`)
- [ ] Same structure as classes
- [ ] Event-specific fields
- [ ] Recurrence support
- [ ] Gallery upload support

---

## 🖼️ 8. Upload Handling
- [ ] Use Cloudinary widget or upload endpoint
- [ ] `UploadButton` component (reusable)
- [ ] Preview thumbnails
- [ ] Allow multi-image upload for gallery

---

## 📩 9. Enquiries Table (`/admin/enquiries`)
- [ ] List of public enquiries
- [ ] Pagination + search
- [ ] Delete/archive action

---

## 🔐 10. Appbar Enhancements
- [ ] Show admin email + avatar
- [ ] Add Logout button
- [ ] Use `theme.palette.orange`, `brown`, `beige`
- [ ] Optionally add a sidebar for wider layouts

---

## 🧠 11. UX Polish
- [ ] Global error handler via Snackbar
- [ ] `<Loader />` from LoadingContext
- [ ] Responsive layout (mobile/tablet friendly)
- [ ] Theme override: rounded corners, soft shadows
- [ ] Consistent font sizes (h6, body1, etc.)

---

## 🚀 12. Optional Nice-to-Haves
- [ ] Admin Quick Links on Dashboard
- [ ] “Create Class” / “Add Event” FAB
- [ ] Dark mode toggle
- [ ] Save column filters in `sessionStorage`
- [ ] Notifications bell (for new bookings, etc.)

---

## 🧩 Folder Reminder (Structure)

src/
├── api/ # axiosInstance.js
├── assets/ # logo, icons
├── components/ # common reusable UI
├── context/ # AuthContext, etc.
├── hooks/ # useAuth, useBookings
├── layouts/ # AdminLayout
├── pages/ # Route pages
├── theme/ # MUI theme
├── utils/ # token helpers, etc.
├── App.jsx # Routing config
└── main.jsx # App entry point