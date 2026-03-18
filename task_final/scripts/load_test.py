from pymongo import MongoClient
import random
import time
import threading
from statistics import mean, median
import matplotlib.pyplot as plt
import numpy as np

# Конфигурация
NUM_THREADS = [10, 20, 30, 50]  # разное количество потоков
OPERATIONS_PER_THREAD = 200
READ_RATIO = 0.7  # 70% чтение, 30% запись

# Подключения
client_sharded = MongoClient('localhost', 27017)
client_standalone = MongoClient('localhost', 27018)

db_sharded = client_sharded['university_db']
db_standalone = client_standalone['university_db_standalone']

students_sharded = db_sharded['students']
students_standalone = db_standalone['students']

# Получаем список всех student_id для чтения
all_student_ids = [doc['student_id'] for doc in students_sharded.find({}, {'student_id': 1})]

def worker(thread_id, db_type, results, num_ops, read_ratio):
    """Функция для потока: выполняет операции чтения/записи"""
    client = MongoClient('localhost', 27017 if db_type == 'sharded' else 27018)
    db = client['university_db' if db_type == 'sharded' else 'university_db_standalone']
    collection = db['students']
    
    latencies = []
    
    for i in range(num_ops):
        start = time.time()
        
        if random.random() < read_ratio:
            # Чтение
            student_id = random.choice(all_student_ids)
            collection.find_one({'student_id': student_id})
        else:
            # Запись (обновление оценки случайного курса)
            student_id = random.choice(all_student_ids)
            collection.update_one(
                {'student_id': student_id},
                {'$inc': {f'courses.{random.randint(0, 2)}.grade': 1}}
            )
        
        end = time.time()
        latencies.append((end - start) * 1000)  # в миллисекундах
    
    results[db_type].extend(latencies)
    client.close()

def run_test(num_threads, db_type):
    """Запускает тест для указанного количества потоков"""
    print(f"  Запуск {num_threads} потоков для {db_type}...")
    results = {db_type: []}
    threads = []
    
    for i in range(num_threads):
        t = threading.Thread(
            target=worker, 
            args=(i, db_type, results, OPERATIONS_PER_THREAD, READ_RATIO)
        )
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    
    latencies = results[db_type]
    return {
        'avg': mean(latencies),
        'median': median(latencies),
        'p95': np.percentile(latencies, 95),
        'min': min(latencies),
        'max': max(latencies),
        'throughput': (num_threads * OPERATIONS_PER_THREAD) / (sum(latencies) / 1000)
    }

# Запускаем тесты
print("Начинаем нагрузочное тестирование...")
print("=" * 60)

results_sharded = {}
results_standalone = {}

for threads in NUM_THREADS:
    print(f"\n--- Тест с {threads} потоками ---")
    
    # Шардированный кластер
    res_s = run_test(threads, 'sharded')
    results_sharded[threads] = res_s
    print(f"  Шардированный: avg={res_s['avg']:.2f}ms, p95={res_s['p95']:.2f}ms, throughput={res_s['throughput']:.0f} ops/sec")
    
    # Standalone
    res_a = run_test(threads, 'standalone')
    results_standalone[threads] = res_a
    print(f"  Standalone:     avg={res_a['avg']:.2f}ms, p95={res_a['p95']:.2f}ms, throughput={res_a['throughput']:.0f} ops/sec")

# Визуализация
plt.figure(figsize=(15, 5))

# График 1: Средняя задержка
plt.subplot(1, 3, 1)
x = list(results_sharded.keys())
y_sharded_avg = [results_sharded[t]['avg'] for t in x]
y_standalone_avg = [results_standalone[t]['avg'] for t in x]
plt.plot(x, y_sharded_avg, 'b-o', label='Sharded')
plt.plot(x, y_standalone_avg, 'r-o', label='Standalone')
plt.xlabel('Количество потоков')
plt.ylabel('Средняя задержка (ms)')
plt.title('Сравнение средней задержки')
plt.legend()
plt.grid(True)

# График 2: 95-й перцентиль
plt.subplot(1, 3, 2)
y_sharded_p95 = [results_sharded[t]['p95'] for t in x]
y_standalone_p95 = [results_standalone[t]['p95'] for t in x]
plt.plot(x, y_sharded_p95, 'b-o', label='Sharded')
plt.plot(x, y_standalone_p95, 'r-o', label='Standalone')
plt.xlabel('Количество потоков')
plt.ylabel('95-й перцентиль (ms)')
plt.title('Сравнение 95-го перцентиля')
plt.legend()
plt.grid(True)

# График 3: Пропускная способность
plt.subplot(1, 3, 3)
y_sharded_tp = [results_sharded[t]['throughput'] for t in x]
y_standalone_tp = [results_standalone[t]['throughput'] for t in x]
plt.plot(x, y_sharded_tp, 'b-o', label='Sharded')
plt.plot(x, y_standalone_tp, 'r-o', label='Standalone')
plt.xlabel('Количество потоков')
plt.ylabel('Пропускная способность (ops/sec)')
plt.title('Сравнение пропускной способности')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('../docs/load_test_results.png', dpi=150)
plt.show()

# Вывод результатов в табличном виде
print("\n" + "="*60)
print("ИТОГОВЫЕ РЕЗУЛЬТАТЫ:")
print("-" * 60)
print(f"{'Потоки':<8} {'Шардированный':<30} {'Standalone':<30}")
print(f"{'':<8} {'avg(ms)':<8} {'p95(ms)':<8} {'ops/sec':<10} {'avg(ms)':<8} {'p95(ms)':<8} {'ops/sec':<10}")
print("-" * 60)

for t in x:
    s = results_sharded[t]
    a = results_standalone[t]
    print(f"{t:<8} {s['avg']:<8.2f} {s['p95']:<8.2f} {s['throughput']:<10.0f} {a['avg']:<8.2f} {a['p95']:<8.2f} {a['throughput']:<10.0f}")

# Закрываем соединения
client_sharded.close()
client_standalone.close()