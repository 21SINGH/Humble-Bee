# 🐝 HumbleBee App Development Checklist

This checklist outlines the core, bonus, and edge features to build in the beekeeping tracker app.

---

## ✅ Core Functionality

### 🐝 Hive Logger Screen
- [✅] Create Hive Log screen UI
- [✅] Inputs: Hive ID, Date, Number of Colonies, Auto-detected Location
- [✅] Save hive log data to SQLite
- [✅] Prevent duplicate Hive IDs
- [✅] Validate all fields before saving
- [ ] Associate crop name with hive log (optional but mentioned in filtering criteria)
- [ ] Empty state: “No hives placed yet”

### 🌾 Crop Opportunities Screen
- [✅] Load crop data from local DB or mock JSON
- [✅] Calculate and show distance from user
- [ ] Filter by current & upcoming flowering window (based on today's date)
- [ ] Sort crops by distance (closest first)
- [ ] Display:
  - [✅] Crop name
  - [✅] Flowering window (start–end)
  - [✅] Distance
  - [✅] Recommended hive density
  - [ ] Label for flowering status: “Flowering now” / “Upcoming”
- [ ] Handle empty state: No crops in range

### 📖 Hive History Screen
- [✅] Show all previously logged hive placements
- [ ] Allow filtering:
  - [ ] By Date
  - [ ] By Crop name (if associated)
  - [ ] By Location radius (bonus)
- [✅] Allow deleting a hive log
- [✅] Allow marking a hive as “Ready to Migrate”
- [ ] UI for empty history
- [ ] Crop name display (if associated)

### 📍 Location Permissions & Management
- [✅] Request foreground location permission
- [ ] Handle denial, revoke, or “never ask again” case
- [ ] Fallback to manual location entry
- [ ] Save and reuse location between screens (avoid repeated fetch)

### 📡 Offline Functionality
- [✅] Ensure all core features work without internet
- [✅] Cache crop data locally
- [ ] Show offline banner: “You are offline”
- [ ] Add retry mechanism when connection resumes

---

## 🌟 Bonus Features
- [ ] Add photo attachment for hive site
- [ ] Push notification 3 days before crop flowering
- [ ] Map view for nearby crops and hive sites
- [ ] Export or simulate sync to BEETRAIL cloud
- [ ] Highlight hives marked “Ready to Migrate”

---

## 🧪 Dev & Testing Checklist
- [✅] Insert dummy Hive Logs for testing
- [ ] Create mock crop JSON data (with structure provided)
- [✅] Use consistent TypeScript types for all queries
- [ ] Add debug tools (test insert/delete/view logs)
- [ ] Handle app resume (background → foreground)
- [ ] Handle edge cases:
  - [ ] No data
  - [ ] Corrupt storage (try-catch fallback)
  - [ ] No crops nearby
- [ ] Optional config/env setup to switch mock/live mode

---

## 🚀 Submission
- [ ] Public GitHub repo with all code
- [ ] Include:
  - [ ] `README.md` with setup instructions
  - [ ] Features implemented
  - [ ] What’s done vs. pending
  - [ ] Screen recording demo
  - [ ] Sync strategy explanation (e.g., for rural network)
