db.createCollection("teachers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "full_name", "department", "hire_date"],
      properties: {
        teacher_id: {
          bsonType: "string",
          description: "Уникальный ID преподавателя",
          pattern: "^TCH-\\d{3}$"
        },
        full_name: {
          bsonType: "string",
          description: "Полное ФИО преподавателя",
          minLength: 5,
          maxLength: 100
        },
        birth_date: {
          bsonType: "date",
          description: "Дата рождения"
        },
        degree: {
          bsonType: "string",
          description: "Ученая степень",
          enum: ["доктор наук", "кандидат наук", "PhD", null]
        },
        position: {
          bsonType: "string",
          description: "Должность",
          enum: ["профессор", "доцент", "старший преподаватель", "ассистент", "преподаватель"]
        },
        department: {
          bsonType: "string",
          description: "Кафедра"
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
        hire_date: {
          bsonType: "date",
          description: "Дата приема на работу"
        },
        subjects: {
          bsonType: "array",
          description: "Преподаваемые предметы",
          items: {
            bsonType: "string",
            pattern: "^[A-Z]{3,4}-\\d{3}$"
          }
        },
        status: {
          bsonType: "string",
          description: "Статус работы",
          enum: ["active", "fired", "retired", "vacation", "sick_leave"]
        },
        office: {
          bsonType: "string",
          description: "Номер кабинета"
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
  validationAction: "warn",
  validationLevel: "strict"
})