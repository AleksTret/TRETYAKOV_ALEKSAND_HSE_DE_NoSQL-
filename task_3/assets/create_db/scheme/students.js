db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["recordbook", "full_name", "group", "enrollment_year"],
      properties: {
        recordbook: {
          bsonType: "string",
          description: "Номер зачетной книжки, обязательное поле",
          pattern: "^\\d{4}-[А-Яа-я]{2,3}-\\d{3}$"
        },
        full_name: {
          bsonType: "string",
          description: "Полное ФИО студента",
          minLength: 5,
          maxLength: 100
        },
        birth_date: {
          bsonType: "date",
          description: "Дата рождения"
        },
        passport: {
          bsonType: "string",
          description: "Серия и номер паспорта"
        },
        group: {
          bsonType: "string",
          description: "Учебная группа",
          pattern: "^[А-Яа-я]{2,3}-\\d{2}-\\d$"
        },
        faculty: {
          bsonType: "string",
          description: "Факультет"
        },
        specialty: {
          bsonType: "string",
          description: "Специальность"
        },
        course: {
          bsonType: "int",
          description: "Курс обучения",
          minimum: 1,
          maximum: 6
        },
        email: {
          bsonType: "string",
          description: "Электронная почта",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        phone: {
          bsonType: "string",
          description: "Номер телефона",
          pattern: "^\\+7\\s\\d{3}\\s\\d{3}-\\d{2}-\\d{2}$"
        },
        enrollment_year: {
          bsonType: "int",
          description: "Год поступления",
          minimum: 2000,
          maximum: 2025
        },
        status: {
          bsonType: "string",
          description: "Статус студента",
          enum: ["active", "graduated", "expelled", "academic_leave", "transferred"]
        },
        created_at: {
          bsonType: "date",
          description: "Дата создания записи"
        },
        updated_at: {
          bsonType: "date",
          description: "Дата обновления записи"
        }
      }
    }
  },
  validationAction: "warn", // или "error" для строгой валидации
  validationLevel: "strict"
})