import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsDoc } from 'src/app/model/products';
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';
import { ProductsConsumedService } from 'src/app/services/products-consumed/products-consumed.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.page.html',
  styleUrls: ['./table-details.page.scss'],
})
export class TableDetailsPage implements OnInit {
  productsConsumed!: Array<ProductsConsumedDoc>;
  total: number = 0;
  tableId: string = '';
  visibleProducts!: ProductsDoc[];

  constructor(
    private prodConsumedService: ProductsConsumedService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService
  ) {
    this.productService.fetchProducts();
  }

  ngOnInit() {
    this.prodConsumedService
      .getCurrentProducts()
      .subscribe((productDocs: Array<ProductsConsumedDoc>) => {
        this.productsConsumed = productDocs;
        console.log(this.productsConsumed);
        this.productsConsumed[0]?.products.forEach((p) => {
          this.total += p.ppp * p.amount;
        });
      });
    this.prodConsumedService.fetchProductsConsumed();

    this.activatedRoute.params.subscribe((params) => {
      this.tableId = params['id'] as string;
    });

    this.productService.getCurrentProducts().subscribe((products) => {
      this.visibleProducts = products;
    });
  }
}
