# Express Products API

REST API produk menggunakan ExpressJS, TypeScript, Prisma, dan PostgreSQL.

## Persyaratan

- Node.js 18 atau lebih baru
- PostgreSQL yang sudah berjalan dan database kosong yang sudah dibuat

## Cara Menjalankan

1. Install dependensi:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` sesuai PostgreSQL di komputer Anda:

   ```
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/NAMA_DATABASE?schema=public"
   PORT=3000
   ```

3. Jalankan migrasi untuk membuat tabel:

   ```bash
   npx prisma migrate dev
   ```

4. Isi data awal (opsional, jalankan sekali saja):

   ```bash
   npm run seed
   ```

5. Jalankan server:

   ```bash
   npm run dev
   ```

Server berjalan di `http://localhost:3000`.

Untuk melihat isi database, jalankan `npm run prisma:studio`.

## Daftar Endpoint

| Method | URL | Deskripsi | Status |
|--------|-----|-----------|--------|
| GET | `/products` | Menampilkan seluruh produk | 200 |
| GET | `/products/:id` | Menampilkan satu produk | 200, 400 jika ID bukan angka, 404 jika tidak ditemukan |
| POST | `/products` | Membuat produk baru | 201, 400 jika data tidak valid |
| PUT | `/products/:id` | Mengubah produk yang sudah ada | 200, 400 jika data atau ID tidak valid, 404 jika tidak ditemukan |
| DELETE | `/products/:id` | Menghapus produk | 200, 400 jika ID bukan angka, 404 jika tidak ditemukan |

### Body untuk POST dan PUT

```json
{
  "name": "Penghapus",
  "price": 3000
}
```

Pada PUT, `id` diambil dari URL. Body boleh menyertakan `id`, tetapi nilainya harus sama dengan `id` pada URL.

Aturan validasi: `name` wajib berupa teks tidak kosong dan `price` wajib berupa angka tidak negatif.

### Contoh Response

GET `/products`

```json
[
  { "id": 1, "name": "Buku", "price": 15000 },
  { "id": 2, "name": "Pulpen", "price": 5000 }
]
```

POST `/products` (201 Created)

```json
{ "id": 3, "name": "Penghapus", "price": 3000 }
```

DELETE `/products/3`

```json
{
  "message": "Produk berhasil dihapus",
  "data": { "id": 3, "name": "Penghapus", "price": 3000 }
}
```

Response error

```json
{ "message": "Produk tidak ditemukan" }
```

## Alur Request dan Response

```
Client -> requestLogger -> route (/products) -> controller -> Prisma -> PostgreSQL -> response (status + JSON)
```

## Struktur Folder

```
express-products-api/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── controllers/
│   │   └── product.controller.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── middleware/
│   │   └── request-logger.ts
│   ├── routes/
│   │   └── product.routes.ts
│   ├── app.ts
│   └── index.ts
├── .env.example
├── package.json
└── tsconfig.json
```
