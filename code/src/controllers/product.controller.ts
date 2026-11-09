import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

function parseId(value: string | string[] | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateProductBody(body: unknown): { name: string; price: number } | string {
  const { name, price } = (body ?? {}) as { name?: unknown; price?: unknown };

  if (typeof name !== 'string' || name.trim() === '') {
    return 'name wajib diisi dan berupa teks';
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return 'price wajib diisi dan berupa angka tidak negatif';
  }

  return { name: name.trim(), price };
}

function isRecordNotFound(error: unknown): boolean {
  return (error as { code?: string }).code === 'P2025';
}

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  res.status(200).json(products);
}

export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: 'ID produk harus berupa angka' });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response) {
  const data = validateProductBody(req.body);

  if (typeof data === 'string') {
    res.status(400).json({ message: data });
    return;
  }

  const product = await prisma.product.create({ data });
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: 'ID produk harus berupa angka' });
    return;
  }

  if (req.body?.id !== undefined && Number(req.body.id) !== id) {
    res.status(400).json({ message: 'id pada body harus sama dengan id pada URL' });
    return;
  }

  const data = validateProductBody(req.body);

  if (typeof data === 'string') {
    res.status(400).json({ message: data });
    return;
  }

  try {
    const product = await prisma.product.update({ where: { id }, data });
    res.status(200).json(product);
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    throw error;
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: 'ID produk harus berupa angka' });
    return;
  }

  try {
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Produk berhasil dihapus', data: product });
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    throw error;
  }
}
