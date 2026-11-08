## Cara Menjalankan

```bash
npm install
npm run dev
```

Server berjalan di `http://localhost:3000`. Port dapat diubah dengan environment variable `PORT`.

Untuk menjalankan versi build:

```bash
npm run build
npm start
```

## Daftar Endpoint

| Method | URL | Deskripsi | Status |
|--------|-----|-----------|--------|
| GET | `/products` | Menampilkan seluruh produk | 200 |
| GET | `/products/:id` | Menampilkan satu produk berdasarkan ID | 200, 404 jika tidak ditemukan, 400 jika ID bukan angka |
| POST | `/products` | Membuat produk baru | 201, 400 jika data tidak valid |

### Contoh

GET `/products`

```json
[
  { "id": 1, "name": "Buku", "price": 15000 },
  { "id": 2, "name": "Pulpen", "price": 5000 }
]
```

GET `/products/999`

```json
{ "message": "Produk tidak ditemukan" }
```

POST `/products`

Request body:

```json
{ "name": "Penggaris", "price": 7500 }
```

Response `201 Created`:

```json
{ "id": 3, "name": "Penggaris", "price": 7500 }
```

Aturan validasi POST: `name` wajib berupa teks tidak kosong dan `price` wajib berupa angka tidak negatif.

## Alur Request dan Response

```
Client -> requestLogger -> route (/products) -> controller -> response (status + JSON)
```

1. Client mengirim request, misalnya `GET /products/1`.
2. `express.json()` membaca body JSON, lalu `requestLogger` mencatat request dan memanggil `next()`.
3. `app.use('/products', productRouter)` meneruskan request ke router produk, dan route mencocokkan method serta path ke fungsi controller.
4. Controller membaca `req.params` atau `req.body`, lalu mengirim status dan JSON melalui `res.status(...).json(...)`.
5. Jika tidak ada route yang cocok, handler terakhir di `app.ts` mengirim 404 dalam format JSON.

## Struktur Folder

| Berkas | Peran |
|--------|-------|
| `index.ts` | Menjalankan server dengan `app.listen()` |
| `app.ts` | Memasang middleware dan router |
| `routes/` | Memasangkan method dan URL ke controller |
| `controllers/` | Membaca request lalu mengirim response |
| `middleware/` | Menjalankan pemrosesan sebelum controller |
| `data/` | Menyimpan data produk dalam array |

## Pengujian

Contoh perintah uji dengan curl:

```bash
curl -i http://localhost:3000/products
curl -i http://localhost:3000/products/1
curl -i http://localhost:3000/products/999
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Penggaris","price":7500}'
```
