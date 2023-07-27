export class ProductsConsumedDoc {
  _id: string = '';
  _rev?: string = '';
  type: string = 'products-consumed';
  table: string = '';
  products: Array<ConsumedProduct> = [];
}

export class ConsumedProduct {
  product: string = '';
  category: string = '';
  amount: number = 0;
  ppp: number = 0.0;
}
