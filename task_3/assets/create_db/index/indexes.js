db.students.createIndex({recordbook: 1}, {unique: true, name: "idx_recordbook"})
db.students.createIndex({group: 1}, {name: "idx_group"})
db.students.createIndex({full_name: 1}, {name: "idx_full_name"})

db.teachers.createIndex({teacher_id: 1}, {unique: true, name: "idx_teacher_id"})
db.teachers.createIndex({full_name: 1}, {name: "idx_teacher_name"})

db.subjects.createIndex({subject_id: 1}, {unique: true, name: "idx_subject_id"})
db.subjects.createIndex({semester: 1, specialty: 1}, {name: "idx_semester_specialty"})

db.grades.createIndex({recordbook: 1, semester: 1}, {name: "idx_grades_student"})
db.grades.createIndex({subject_id: 1}, {name: "idx_grades_subject"})
db.grades.createIndex({teacher_id: 1}, {name: "idx_grades_teacher"})
db.grades.createIndex({recordbook: 1, subject_id: 1, semester: 1}, {name: "idx_grades_student_subject"})