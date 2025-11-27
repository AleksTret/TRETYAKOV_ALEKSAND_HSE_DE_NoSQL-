# Домашнее задание 1
**Колоночные (аналитические) базы данных**

**Практика работы с ClickHouse**

**Выполнил - Третьяков Александр Юрьевич**

## Задание
Составьте запросы и найдите ответы на следующие вопросы (в
домашней работе требуется как текст запроса, так и результат его исполнения).
- Посчитать общее количество записей в таблице (сколько всего поездок)
- Найти, сколько поездок сопровождались «крупными» чаевыми (больше
$20)
- Определить среднюю продолжительность поездки в минутах
- Найти 5 самых популярных зон для начала поездки и вывести их
названия вместе с количеством поездок
- Найти топ-3 дня, в которые была наибольшая суммарная выручка
## Решение
Покажем наличие базы такси и наличие таблиц
<img src="./assets/2025-11-27 163851.jpg" width="700">

<img src="./assets/2025-11-27 163943.jpg" width="700">

<img src="./assets/2025-11-27 164023.jpg" width="900">

1. Посчитаем общее количество записей
```sql
SELECT count(*) as total_trips FROM nyc_taxi.trips_small;
```
<img src="./assets/2025-11-27 164338.jpg" width="700">

2. Найдем количество поездок с чаевыми больше $20

```sql
SELECT count(*) as trips_gt_20_tips
FROM nyc_taxi.trips_small 
WHERE tip_amount > 20;
```
<img src="./assets/2025-11-27 164817.jpg" width="900">

3. Определим среднюю продолжительность поездки
```sql
SELECT 
    round(
        avg(
            dateDiff(
                'minute'
                ,pickup_datetime
                ,dropoff_datetime
                )
        ), 
        2
    ) AS avg_duration_minutes
FROM nyc_taxi.trips_small
WHERE 
    -- Исключим некорректные записи
    pickup_datetime < dropoff_datetime;
```

<img src="./assets/2025-11-27 165328.jpg" width="900">

4. Найдем 5 самых популярных зон для начала поездки
```sql
SELECT 
    pickup_ntaname,
    count(*) as trip_count
FROM nyc_taxi.trips_small
WHERE pickup_ntaname != ''
GROUP BY pickup_ntaname
ORDER BY trip_count DESC
LIMIT 5;
```

<img src="./assets/2025-11-27 170016.jpg" width="900">

5. Найдем 3 дня с наибольшей выручкой

```sql
SELECT 
    toDate(pickup_datetime) as day,
    round(sum(total_amount),2) as total_revenue,
    count(*) as trip_count
FROM nyc_taxi.trips_small
GROUP BY day
ORDER BY total_revenue DESC
LIMIT 3;
```

<img src="./assets/2025-11-27 170336.jpg" width="900">