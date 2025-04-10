# 🐝 HumbleBee App Development Checklist

This checklist outlines the core and bonus features to build and submit your beekeeping tracker app.

---

## ✅ Core Functionality

### 🐝 Hive Logger Screen
- [ ] Create Hive Log screen UI
- [ ] Inputs: Hive ID, Date, Number of Colonies, Auto-detected Location
- [ ] Save hive log data to SQLite
- [ ] Prevent duplicate Hive IDs
- [ ] Validate all fields before saving

### 🌾 Crop Opportunities Screen
- [ ] Load crop data from local JSON or DB
- [ ] Calculate and show distance from user
- [ ] Filter by current & upcoming flowering window
- [ ] Display:
  - [ ] Crop name
  - [ ] Flowering window (start–end)
  - [ ] Distance
  - [ ] Recommended hive density
- [ ] Handle empty state: No crops in range

### 📖 Hive History Screen
- [ ] Show all previously logged hive placements
- [ ] Allow filtering:
  - [ ] By Date
  - [ ] By Crop name (optional if associated)
  - [ ] By Location radius (bonus)
- [ ] Allow deleting a hive log
- [ ] Allow marking a hive as “Ready to Migrate”

### 📍 Location Permissions
- [ ] Request foreground location permission
- [ ] Handle denial, revoke, or “never ask again” case
- [ ] Fallback to manual location entry

### 📡 Offline Functionality
- [ ] Ensure all core features work without internet
- [ ] Cache crop data locally
- [ ] Show offline banner
- [ ] Add retry mechanism when connection resumes

---

## 🌟 Bonus Features
- [ ] Add photo attachment for hive site
- [ ] Push notification 3 days before crop flowering
- [ ] Map view for nearby crops and hive sites
- [ ] Export or simulate sync to BEETRAIL cloud
- [ ] Highlight hives “Ready to Migrate”

---

## 🧪 Dev & Testing Checklist
- [ ] Create mock crop JSON data
- [ ] Insert dummy Hive Logs for testing
- [ ] Use consistent TypeScript types for all queries
- [ ] Add debug tools (test insert/delete/view logs)
- [ ] Handle app resume (background → foreground)
- [ ] Show UI for:
  - [ ] No data
  - [ ] Corrupt storage
  - [ ] No crops nearby

---

## 🚀 Submission
- [ ] Public GitHub repo with all code
- [ ] Include:
  - [ ] README with setup instructions
  - [ ] Features implemented
  - [ ] What’s done vs. pending
  - [ ] Screen recording demo
  - [ ] Sync strategy explanation (e.g., for rural network)
