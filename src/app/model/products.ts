export class ProductsDoc {
  _id: string = '';
  _rev: string = '';
  type: string = 'products';
  products: Array<Product> = [];
}

export class Product {
  product: string = '';
  category: string = '';
  ppp: number = 0.0;
  stock?: string = '';
}
