# Шардированный кластер MongoDB

**Полный отчёт с анализом производительности доступен в docs/report.md.**

## Описание проекта
Проект реализует шардированный кластер MongoDB для хранения данных о студентах университета. Включает:
- 3 шарда
- 3 конфигурационных сервера
- Маршрутизатор mongos
- Отдельный standalone MongoDB для сравнения производительности

## Требования
- Docker и Docker Compose
- Python 3.8+

## Быстрый старт

### 1. Запуск кластера
```bash
cd docker
docker-compose up -d
```

После запуска инициализация replica set для config servers:

```bash
docker exec -it mongodb-config1 mongosh --port 27017
```

В консоли MongoDB :

```javascript
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [
    { _id: 0, host: "config1:27017" },
    { _id: 1, host: "config2:27017" },
    { _id: 2, host: "config3:27017" }
  ]
})
```
Проверка статуса
```javascript
rs.status()
``` 

<img src="./assets/2026-03-18 074554.jpg" width="700"> 

Инициализация репликасетов для каждого шарда

Для шарда 1:
```bash
docker exec -it mongodb-shard1 mongosh --port 27018
```
```javascript
rs.initiate({
  _id: "shard1ReplSet",
  members: [{ _id: 0, host: "shard1:27018" }]
})
exit
```
Для шарда 2:
```bash
docker exec -it mongodb-shard2 mongosh --port 27019
```
```javascript
rs.initiate({
  _id: "shard2ReplSet",
  members: [{ _id: 0, host: "shard2:27019" }]
})
exit
```
Для шарда 3:
```bash
docker exec -it mongodb-shard3 mongosh --port 27020
```
```javascript
rs.initiate({
  _id: "shard3ReplSet",
  members: [{ _id: 0, host: "shard3:27020" }]
})
exit
```
<img src="./assets/2026-03-18 080040.jpg" width="700"> 

Добавление шардов на маршрутизаторе (mongos) 
```bash
docker exec -it mongodb-mongos mongosh --port 27021
```
Добавляем шарды в кластер в консоли mongos :

```javascript
// Добавляем шард 1
sh.addShard("shard1ReplSet/shard1:27018")

// Добавляем шард 2
sh.addShard("shard2ReplSet/shard2:27019")

// Добавляем шард 3
sh.addShard("shard3ReplSet/shard3:27020")
```
Проверяем статус кластера
```javascript
sh.status()
```
Все три шарда должны быть в статусе `OK`.

<img src="./assets/2026-03-18 081217.jpg" width="700"> 

Включение шардинга для базы данных и коллекции
```javascript
// Включаем шардинг для БД
sh.enableSharding("university_db")

// Создаем индекс для шард-ключа (хешированный)
db.getSiblingDB("university_db").students.createIndex({student_id: "hashed"})

// Шардируем коллекцию
sh.shardCollection("university_db.students", {student_id: "hashed"})
```
Проверяем результат
```javascript
sh.status()
```
В выводе должно быть видно, что коллекция `students` шардирована и чанки распределены по шардам.

<img src="./assets/2026-03-18 081409.jpg" width="700"> 

<img src="./assets/2026-03-18 081237.jpg " width="700"> 

Для сравнения: проверим standalone MongoDB
В отдельном терминале:

```bash
docker exec -it mongodb-standalone mongosh --port 27022
```
Там просто создадим базу:

```javascript
use university_db_standalone
```

Сгенерируем данные

Для этого воспользуемся скриптом

Установим зависимости для скрипта

```bash
 python -m venv venv
 .\venv\Scripts\Activate.ps1 
(venv) pip install pymongo faker tqdm
```

Запустим скрипт
```bash
(venv) python .\generate_data.py
```
<img src="./assets/2026-03-18 083718.jpg" width="700"> 

<img src="./assets/2026-03-18 084258.jpg" width="700"> 

Выполним нагрузочное тестирование

Для выполнения скрипт с нагрузочным тестированием понадобятся
```bash
pip install matplotlib numpy
```
Запуск скрипта
```
python load_test.py
```


Результаты
Полный отчёт с анализом производительности доступен в `docs/report.md`.



Остановка кластера
```bash
cd ../docker
docker-compose down
# Для полной очистки (с удалением данных):
docker-compose down -v
```

Примечания
- Все контейнеры работают в одной сети shard-network
- Порты наружу:
    - 27017 → mongos (шардированный кластер)
    - 27018 → standalone (для сравнения)


Для выполнения CRUD-операций реализован консольный клиент.

```bash
cd scripts
.\venv\Scripts\Activate.ps1
python client_interface.py
```
Возможности меню:
- Просмотр первых 10 студентов
- Поиск студента по student_id
- Добавление нового студента
- Обновление данных студента
- Удаление студента
- Просмотр статистики распределения данных по шардам

<img src="./assets/2026-03-18 092740.jpg" width="600"> 

<img src="./assets/2026-03-18 092806.jpg" width="400"> 

<img src="./assets/2026-03-18 092844.jpg" width="900"> 
