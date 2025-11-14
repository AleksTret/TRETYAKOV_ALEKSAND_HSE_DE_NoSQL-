# Домашнее задание 1

**Выполнил - Третьяков Александр Юрьевич**

## Задание
Составьте запросы и найдите ответы на следующие вопросы (в домашней работе
требуется как текст запроса, так и результат его исполнения). Рекомендуется использовать
консольный клиент.
- Найти количество объектов, находящихся в Лондоне.
- Найти количество объектов с ценой выше $200.
- Найти объект с минимальной ценой.
- Найти город с максимальным количеством объектов.
- Найти объект с наибольшим количеством отзывов и вывести его название и
количество отзыво



## Решение

### 1. Найти количество объектов, находящихся в Лондоне.

Попробуем поискать город Лондон во всех полях адреса
```js
db.listingsAndReviews.countDocuments({
  $or: [
    {"address.market": /London/i},
    {"address.government_area": /London/i},
    {"address.suburb": /London/i},
    {"address.street": /London/i}
  ]
})
```
Результат `= 0`. Адресов находящихся в Лондоне нет.

<img src="./assets/2025-11-14 180917.jpg" width="700">

### 2. Найти количество объектов с ценой выше $200

```js
db.listingsAndReviews.countDocuments({
  "price": {$gt: Decimal128("200.00")}
})
```

<img src="./assets/2025-11-14 181633.jpg" width="700">

### 3. Найти объект с минимальной ценой

```js
db.listingsAndReviews.find(
  {price: {$exists: true}},
  {name: 1, price: 1, "address.country": 1, "address.market": 1}
).sort({"price": 1}).limit(1).pretty()
```

<img src="./assets/2025-11-14 182109.jpg" width="700">

### 4. Найти город с максимальным количеством объектов

```js
db.listingsAndReviews.aggregate([
  {$match: {"address.market": {$exists: true, $ne: ""}}},
  {$group: {_id: "$address.market", count: {$sum: 1}}},
  {$sort: {count: -1}},
  {$limit: 1}
])
```

<img src="./assets/2025-11-14 182320.jpg" width="700">

### 5. Найти объект с наибольшим количеством отзывов и вывести его название и количество отзывов

```js
db.listingsAndReviews.find(
  {number_of_reviews: {$exists: true}},
  {name: 1, number_of_reviews: 1, "address.country": 1, "address.market": 1}
).sort({number_of_reviews: -1}).limit(1).pretty()
```

<img src="./assets/2025-11-14 182658.jpg" width="700">