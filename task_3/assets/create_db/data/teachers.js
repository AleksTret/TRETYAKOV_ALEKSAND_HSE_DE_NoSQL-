// teachers.js
db.teachers.insertMany([
  {
    teacher_id: "TCH-001",
    full_name: "Петров Сергей Иванович",
    birth_date: ISODate("1975-03-15"),
    degree: "доктор наук",
    position: "профессор",
    department: "кафедра математики",
    email: "petrov@univer.ru",
    phone: "+7 999 555-44-33",
    hire_date: ISODate("2005-09-01"),
    subjects: ["MATH-101", "CRYP-201"],
    status: "active"
  },
  {
    teacher_id: "TCH-002",
    full_name: "Иванова Мария Владимировна",
    birth_date: ISODate("1982-08-22"),
    degree: "кандидат наук",
    position: "доцент",
    department: "кафедра программирования",
    email: "ivanova@univer.ru",
    phone: "+7 999 555-44-34",
    hire_date: ISODate("2010-09-01"),
    subjects: ["PROG-102", "ALG-201", "WEB-401"],
    status: "active"
  },
  {
    teacher_id: "TCH-003",
    full_name: "Сидоров Алексей Петрович",
    birth_date: ISODate("1988-11-05"),
    degree: "кандидат наук",
    position: "старший преподаватель",
    department: "кафедра информационных систем",
    email: "sidorov@univer.ru",
    phone: "+7 999 555-44-35",
    hire_date: ISODate("2015-09-01"),
    subjects: ["DB-202", "ARCH-303"],
    status: "active"
  },
  {
    teacher_id: "TCH-004",
    full_name: "Козлова Елена Дмитриевна",
    birth_date: ISODate("1979-06-18"),
    degree: "кандидат наук",
    position: "доцент",
    department: "кафедра сетевых технологий",
    email: "kozlova@univer.ru",
    phone: "+7 999 555-44-36",
    hire_date: ISODate("2008-09-01"),
    subjects: ["NET-102", "OS-301", "FORENS-401"],
    status: "active"
  },
  {
    teacher_id: "TCH-005",
    full_name: "Морозов Денис Андреевич",
    birth_date: ISODate("1990-02-28"),
    degree: "кандидат наук",
    position: "ассистент",
    department: "кафедра кибербезопасности",
    email: "morozov@univer.ru",
    phone: "+7 999 555-44-37",
    hire_date: ISODate("2018-09-01"),
    subjects: ["SEC-101", "PENTEST-402"],
    status: "active"
  },
  {
    teacher_id: "TCH-006",
    full_name: "Волкова Анна Сергеевна",
    birth_date: ISODate("1985-04-12"),
    degree: "кандидат наук",
    position: "доцент",
    department: "кафедра права",
    email: "volkova@univer.ru",
    phone: "+7 999 555-44-38",
    hire_date: ISODate("2012-09-01"),
    subjects: ["LAW-202", "AUDIT-301"],
    status: "active"
  },
  {
    teacher_id: "TCH-007",
    full_name: "Никитин Игорь Викторович",
    birth_date: ISODate("1972-09-30"),
    degree: "доктор наук",
    position: "профессор",
    department: "кафедра программной инженерии",
    email: "nikitin@univer.ru",
    phone: "+7 999 555-44-39",
    hire_date: ISODate("2000-09-01"),
    subjects: ["SOFT-302", "AI-402"],
    status: "active"
  }
])