from pymongo import MongoClient
import sys

def print_menu():
    print("\n" + "="*50)
    print("УПРАВЛЕНИЕ ДАННЫМИ СТУДЕНТОВ")
    print("="*50)
    print("1. Показать всех студентов")
    print("2. Найти студента по ID")
    print("3. Добавить нового студента")
    print("4. Обновить данные студента")
    print("5. Удалить студента")
    print("6. Показать статистику по шардам")
    print("0. Выход")
    print("="*50)

def show_all_students(collection):
    students = collection.find().limit(10)
    print("\n--- Первые 10 студентов ---")
    for s in students:
        print(f"{s['student_id']}: {s['name']}, {s['faculty']}, курсов: {len(s['courses'])}")

def find_student(collection):
    student_id = input("Введите student_id: ")
    student = collection.find_one({"student_id": student_id})
    if student:
        print("\n--- Найден студент ---")
        print(f"ID: {student['student_id']}")
        print(f"Имя: {student['name']}")
        print(f"Email: {student['email']}")
        print(f"Факультет: {student['faculty']}")
        print(f"Год поступления: {student['enrollment_year']}")
        print("Курсы:")
        for c in student['courses']:
            print(f"  - {c['name']} ({c['course_id']}): {c['grade']}")
    else:
        print("Студент не найден")

def add_student(collection):
    print("\n--- Добавление нового студента ---")
    student_id = input("Student ID (например ST100001): ")
    name = input("Имя: ")
    email = input("Email: ")
    faculty = input("Факультет: ")
    year = int(input("Год поступления: "))
    
    student = {
        "student_id": student_id,
        "name": name,
        "email": email,
        "faculty": faculty,
        "enrollment_year": year,
        "courses": []
    }
    
    result = collection.insert_one(student)
    print(f"Студент добавлен с _id: {result.inserted_id}")

def update_student(collection):
    student_id = input("Введите student_id для обновления: ")
    student = collection.find_one({"student_id": student_id})
    if not student:
        print("Студент не найден")
        return
    
    print("Оставьте поле пустым, чтобы не менять")
    new_name = input(f"Новое имя ({student['name']}): ")
    new_email = input(f"Новый email ({student['email']}): ")
    
    update_data = {}
    if new_name:
        update_data["name"] = new_name
    if new_email:
        update_data["email"] = new_email
    
    if update_data:
        collection.update_one({"student_id": student_id}, {"$set": update_data})
        print("Данные обновлены")
    else:
        print("Нет изменений")

def delete_student(collection):
    student_id = input("Введите student_id для удаления: ")
    result = collection.delete_one({"student_id": student_id})
    if result.deleted_count > 0:
        print("Студент удалён")
    else:
        print("Студент не найден")

def show_shard_stats(client):
    stats = client.admin.command("getShardMap")
    print("\n--- Статистика по шардам ---")
    for shard, host in stats.items():
        print(f"{shard}: {host}")

def main():
    # Подключение к шардированному кластеру
    client = MongoClient('localhost', 27017)
    db = client['university_db']
    collection = db['students']
    
    while True:
        print_menu()
        choice = input("Выберите действие: ")
        
        if choice == '1':
            show_all_students(collection)
        elif choice == '2':
            find_student(collection)
        elif choice == '3':
            add_student(collection)
        elif choice == '4':
            update_student(collection)
        elif choice == '5':
            delete_student(collection)
        elif choice == '6':
            show_shard_stats(client)
        elif choice == '0':
            print("Выход...")
            client.close()
            sys.exit(0)
        else:
            print("Неверный выбор, попробуйте снова")

if __name__ == "__main__":
    main()