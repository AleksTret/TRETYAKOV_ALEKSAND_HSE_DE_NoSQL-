from pymongo import MongoClient
import random
from faker import Faker
from tqdm import tqdm
import time

fake = Faker('ru_RU')

# Подключение к шардированному кластеру через mongos
client_sharded = MongoClient('localhost', 27017)
db_sharded = client_sharded['university_db']
students_sharded = db_sharded['students']

# Подключение к standalone для сравнения
client_standalone = MongoClient('localhost', 27018)
db_standalone = client_standalone['university_db_standalone']
students_standalone = db_standalone['students']

# Очищаем коллекции (если нужно)
students_sharded.delete_many({})
students_standalone.delete_many({})

# Генерируем 100 000 студентов
faculties = ['ФКН', 'Экономика', 'Право', 'Медицина', 'Филология', 'Физика', 'Химия']
courses = [
    {'course_id': 'CS101', 'name': 'Python для инженерии данных'},
    {'course_id': 'CS102', 'name': 'Алгоритмы и структуры данных'},
    {'course_id': 'MATH201', 'name': 'Математический анализ'},
    {'course_id': 'MATH202', 'name': 'Линейная алгебра'},
    {'course_id': 'DB101', 'name': 'Базы данных'},
    {'course_id': 'DB102', 'name': 'Нереляционные базы данных'},
    {'course_id': 'STAT301', 'name': 'Статистика'},
    {'course_id': 'ML401', 'name': 'Машинное обучение'}
]

print("Генерация 100 000 студентов...")
start_time = time.time()

batch = []
for i in tqdm(range(1, 100001)):
    student = {
        'student_id': f'ST{i:06d}',
        'name': fake.name(),
        'email': fake.email(),
        'faculty': random.choice(faculties),
        'enrollment_year': random.randint(2020, 2025),
        'courses': random.sample(courses, k=random.randint(2, 5))
    }
    # Добавляем оценки к курсам
    for course in student['courses']:
        course['grade'] = random.randint(60, 100)
    
    batch.append(student)
    
    # Вставляем батчами по 1000 записей
    if len(batch) >= 1000:
        students_sharded.insert_many(batch)
        students_standalone.insert_many(batch)
        batch = []

# Вставляем остаток
if batch:
    students_sharded.insert_many(batch)
    students_standalone.insert_many(batch)

end_time = time.time()
print(f"Генерация завершена за {end_time - start_time:.2f} сек")

# Проверка
print(f"Шардированный кластер: {students_sharded.count_documents({})} записей")
print(f"Standalone: {students_standalone.count_documents({})} записей")