db.createCollection("grades", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["recordbook", "subject_id", "grade", "teacher_id", "semester"],
      properties: {
        recordbook: {
          bsonType: "string",
          description: "Номер зачетной книжки студента",
          pattern: "^\\d{4}-[А-Яа-я]{2,3}-\\d{3}$"
        },
        subject_id: {
          bsonType: "string",
          description: "ID предмета",
          pattern: "^[A-Z]{3,4}-\\d{3}$"
        },
        grade: {
          bsonType: ["int", "string"],
          description: "Оценка (число или 'зачет'/'незачет')",
          enum: [2, 3, 4, 5, "зачет", "незачет"]
        },
        teacher_id: {
          bsonType: "string",
          description: "ID преподавателя",
          pattern: "^TCH-\\d{3}$"
        },
        date: {
          bsonType: "date",
          description: "Дата выставления оценки"
        },
        semester: {
          bsonType: "int",
          description: "Семестр",
          minimum: 1,
          maximum: 8
        },
        academic_year: {
          bsonType: "string",
          description: "Учебный год",
          pattern: "^\\d{4}-\\d{4}$"
        },
        grade_type: {
          bsonType: "string",
          description: "Тип оценки",
          enum: ["экзамен", "зачет", "курсовая", "практика"]
        },
        attempt: {
          bsonType: "int",
          description: "Попытка сдачи",
          minimum: 1,
          maximum: 3
        },
        is_retake: {
          bsonType: "bool",
          description: "Пересдача"
        },
        comments: {
          bsonType: "string",
          description: "Комментарии преподавателя",
          maxLength: 500
        },
        created_at: {
          bsonType: "date",
          description: "Дата создания записи"
        }
      }
    }
  },
  validationAction: "warn",
  validationLevel: "strict"
})