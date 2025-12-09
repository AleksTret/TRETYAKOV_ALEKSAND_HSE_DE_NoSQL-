print("=== СБРОС И ПЕРЕСОЗДАНИЕ БАЗЫ ДАННЫХ ===");

// 1. Удалить старую БД
try {
  db = db.getSiblingDB('GRADES_SYSTEM');
  db.dropDatabase();
  print("✓ Старая БД GRADES_SYSTEM удалена");
} catch (e) {
  print("✗ Ошибка удаления БД: " + e);
}

// 2. Создать новую БД
try {
  db = db.getSiblingDB('GRADES_SYSTEM');
  print("✓ Новая БД GRADES_SYSTEM создана");
} catch (e) {
  print("✗ Ошибка создания БД: " + e);
}

// 3. Далее идет старый init_database.js код
print("\n=== ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ УНИВЕРСИТЕТ ===");

// 4. Создание схем (валидация)
print("\n=== 1. СОЗДАНИЕ СХЕМ ===");
try {
  load("scheme/students.js");
  print("✓ Схема students создана");
} catch (e) {
  print("✗ Ошибка создания схемы students: " + e);
}

try {
  load("scheme/teachers.js");
  print("✓ Схема teachers создана");
} catch (e) {
  print("✗ Ошибка создания схемы teachers: " + e);
}

try {
  load("scheme/subjects.js");
  print("✓ Схема subjects создана");
} catch (e) {
  print("✗ Ошибка создания схемы subjects: " + e);
}

try {
  load("scheme/grades.js");
  print("✓ Схема grades создана");
} catch (e) {
  print("✗ Ошибка создания схемы grades: " + e);
}

// 5. Создание индексов
print("\n=== 2. СОЗДАНИЕ ИНДЕКСОВ ===");
try {
  load("index/indexes.js");
  print("✓ Все индексы созданы");
} catch (e) {
  print("✗ Ошибка создания индексов: " + e);
}

// 6. Заполнение данными
print("\n=== 3. ЗАПОЛНЕНИЕ ДАННЫМИ ===");

// 6.1 Студенты
print("- Загрузка студентов...");
try {
  load("data/students_1.js");
  load("data/students_2.js");
  load("data/students_3.js");
  load("data/students_4.js");
  print(`✓ Студенты загружены: ${db.students.countDocuments()} записей`);
} catch (e) {
  print("✗ Ошибка загрузки студентов: " + e);
}

// 6.2 Преподаватели
print("- Загрузка преподавателей...");
try {
  load("data/teachers.js");
  print(`✓ Преподаватели загружены: ${db.teachers.countDocuments()} записей`);
} catch (e) {
  print("✗ Ошибка загрузки преподавателей: " + e);
}

// 6.3 Предметы
print("- Загрузка предметов...");
try {
  load("data/subjects.js");
  print(`✓ Предметы загружены: ${db.subjects.countDocuments()} записей`);
} catch (e) {
  print("✗ Ошибка загрузки предметов: " + e);
}

// 6.4 Связь предметов с преподавателями
print("- Связывание предметов с преподавателями...");
try {
  load("data/update_subjects_teachers.js");
  print("✓ Предметы связаны с преподавателями");
} catch (e) {
  print("✗ Ошибка связывания: " + e);
}

// 6.5 Оценки
print("- Загрузка оценок...");
try {
  load("data/grades_1.js");
  load("data/grades_2.js");
  load("data/grades_3.js");
  load("data/grades_4.js");
  print(`✓ Оценки загружены: ${db.grades.countDocuments()} записей`);
} catch (e) {
  print("✗ Ошибка загрузки оценок: " + e);
}

// 7. Итоговая статистика
print("\n=== ИТОГОВАЯ СТАТИСТИКА ===");
print(`Студенты: ${db.students.countDocuments()} записей`);
print(`Преподаватели: ${db.teachers.countDocuments()} записей`);
print(`Предметы: ${db.subjects.countDocuments()} записей`);
print(`Оценки: ${db.grades.countDocuments()} записей`);

// Проверка связей
print("\n=== ПРОВЕРКА СВЯЗЕЙ ===");
print("Предметы с преподавателями: " + 
  db.subjects.find({teachers: {$exists: true, $ne: []}}).count() + " из " + 
  db.subjects.countDocuments());

print("Оценки с валидными студентами: " + 
  db.grades.aggregate([{
    $lookup: {
      from: "students",
      localField: "recordbook",
      foreignField: "recordbook",
      as: "student_info"
    }
  }, {
    $match: {
      student_info: {$ne: []}
    }
  }, {
    $count: "valid_grades"
  }]).next().valid_grades + " из " + db.grades.countDocuments());

print("\n=== СБРОС И ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНЫ УСПЕШНО ===");