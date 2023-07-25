export class ProductsDoc {
  _id: string = '';
  _rev: string = '';
  type: string = 'products';
  table: string = '';
  products: Array<Product> = [];
}

export class Product {
  product: string = '';
  category: string = '';
  amount: number = 0;
  ppp: number = 0.0;
}
