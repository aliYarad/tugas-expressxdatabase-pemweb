import type { Request, Response } from 'express';
import { products } from '../data/products.js';
import type { Product } from '../data/products.js';

export function getProducts(req: Request, res: Response) {
  res.status(200).json(products);
}

export function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ message: 'ID produk harus berupa angka' });
    return;
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

export function createProduct(req: Request, res: Response) {
  const { name, price } = req.body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ message: 'name wajib diisi dan berupa teks' });
    return;
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    res.status(400).json({ message: 'price wajib diisi dan berupa angka tidak negatif' });
    return;
  }

  const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const product: Product = { id: nextId, name: name.trim(), price };

  products.push(product);
  res.status(201).json(product);
}
