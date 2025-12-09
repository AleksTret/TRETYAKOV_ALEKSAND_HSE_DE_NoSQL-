// update_subjects_teachers.js

// TCH-001
db.subjects.updateMany(
  { subject_id: { $in: ["MATH-101", "CRYP-201"] } },
  { $set: { teachers: ["TCH-001"] } }
)

// TCH-002
db.subjects.updateMany(
  { subject_id: { $in: ["PROG-102", "ALG-201", "WEB-401"] } },
  { $set: { teachers: ["TCH-002"] } }
)

// TCH-003
db.subjects.updateMany(
  { subject_id: { $in: ["DB-202", "ARCH-303"] } },
  { $set: { teachers: ["TCH-003"] } }
)

// TCH-004
db.subjects.updateMany(
  { subject_id: { $in: ["NET-102", "OS-301", "FORENS-401"] } },
  { $set: { teachers: ["TCH-004"] } }
)

// TCH-005
db.subjects.updateMany(
  { subject_id: { $in: ["SEC-101", "PENTEST-402"] } },
  { $set: { teachers: ["TCH-005"] } }
)

// TCH-006
db.subjects.updateMany(
  { subject_id: { $in: ["LAW-202", "AUDIT-301"] } },
  { $set: { teachers: ["TCH-006"] } }
)

// TCH-007
db.subjects.updateMany(
  { subject_id: { $in: ["SOFT-302", "AI-402"] } },
  { $set: { teachers: ["TCH-007"] } }
)