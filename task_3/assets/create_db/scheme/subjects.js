db.createCollection("subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["subject_id", "name", "semester", "specialty"],
      properties: {
        subject_id: {
          bsonType: "string",
          description: "Уникальный ID предмета",
          pattern: "^[A-Z]{3,4}-\\d{3}$"
        },
        name: {
          bsonType: "string",
          description: "Название предмета",
          minLength: 3,
          maxLength: 150
        },
        credits: {
          bsonType: "int",
          description: "Количество кредитов",
          minimum: 1,
          maximum: 10
        },
        hours: {
          bsonType: "int",
          description: "Общее количество часов",
          minimum: 36,
          maximum: 200
        },
        semester: {
          bsonType: "int",
          description: "Семестр изучения",
          minimum: 1,
          maximum: 8
        },
        specialty: {
          bsonType: "string",
          description: "Специальность",
          enum: ["Программная инженерия", "Кибербезопасность", "Информационные системы"]
        },
        type: {
          bsonType: "string",
          description: "Тип аттестации",
          enum: ["экзамен", "зачет"]
        },
        teachers: {
          bsonType: "array",
          description: "Преподаватели предмета",
          items: {
            bsonType: "string",
            pattern: "^TCH-\\d{3}$"
          }
        },
        description: {
          bsonType: "string",
          description: "Описание предмета",
          maxLength: 500
        },
        requirements: {
          bsonType: "array",
          description: "Необходимые требования",
          items: {
            bsonType: "string"
          }
        },
        is_active: {
          bsonType: "bool",
          description: "Активен ли предмет"
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