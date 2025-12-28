# Implementation Plan: Admin Panel & Game Enhancements

## 1. Database & Authentication Upgrades
We will modify the core infrastructure to support User Roles (Admin/User) and dynamic Level storage.
- **Schema Update**:
  - Add `role` field to `User` model (default: `'USER'`).
  - Ensure `Level` model supports all game fields (narrative, choices, media).
- **Authentication**:
  - Update `NextAuth` callbacks to include `role` in the session object.
  - Implement a `requireAdmin` middleware/helper for API protection.
  - Update `app/page.tsx` to redirect Admins to `/admin/dashboard` upon login.

## 2. Music & Audio System Restoration
We will restore the persistent background music and mute functionality.
- **Global Player**:
  - Mount `GlobalAudioPlayer` in `app/layout.tsx` so music persists across page navigations.
  - Ensure the "Mute/Unmute" button is visible in the UI (likely in a fixed corner or Navbar).
- **Audio Management**:
  - Verify audio files exist in `public/audio`.
  - Add API endpoints to upload new music files via the Admin Panel.

## 3. Admin Panel Implementation
We will create a secure, Matrix-themed Admin interface.
- **Structure**:
  - `/admin/dashboard`: Overview of stats (active users, recent completions).
  - `/admin/levels`: Level management (CRUD).
  - `/admin/users`: User management (Scoreboard, Ban, Edit Karma).
  - `/admin/media`: File manager for uploading audio/images.
- **Theme**:
  - Reuse `MatrixBackground` and `Terminal` components to maintain the "Hacker" aesthetic.
  - Use "System Admin" styled UI (green/black terminal aesthetic).

## 4. Dynamic Level System
We will transition from hardcoded files to a database-driven level system.
- **Level Editor**:
  - Form to create/edit levels: Title, Description, Unlock Codes, Narrative Text.
  - "Song Selector" to choose background music for the level.
- **Game Logic Update**:
  - Modify `app/levels/[id]/page.tsx` to attempt fetching level data from the Database first.
  - Fallback to `data/story.ts` if no DB entry exists (preserves existing levels).

## 5. User Management Features
- **Scoreboard Control**:
  - Admins can edit user scores, karma, and flags captured (useful for fixing bugs or testing).
  - "Reset User" functionality.

## Execution Order
1.  **Schema & Auth**: Apply DB changes and update login flow.
2.  **Music Fix**: Restore the global player immediately.
3.  **Admin UI**: Build the shell and Dashboard.
4.  **Level & User Managers**: Implement the logic and APIs.
5.  **Testing**: Verify Admin access, Level creation, and Music controls.