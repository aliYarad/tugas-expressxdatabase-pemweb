export interface Product {
  id: number;
  name: string;
  price: number;
}

export const products: Product[] = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];
