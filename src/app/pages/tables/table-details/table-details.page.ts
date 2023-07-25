import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, ProductsDoc } from 'src/app/model/products';
import { ProductsConsumedDoc } from 'src/app/model/productsConsumed';
import { ProductsConsumedService } from 'src/app/services/products-consumed/products-consumed.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.page.html',
  styleUrls: ['./table-details.page.scss'],
})
export class TableDetailsPage implements OnInit {
  tableId: string = '';
  prodConsumed: ProductsConsumedDoc = new ProductsConsumedDoc();
  visibleProducts: Array<ProductsDoc> = [];

  subscriptions: Array<Subscription> = [];

  constructor(
    private prodConsumedService: ProductsConsumedService,
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ionViewWillEnter() {
    this.tableId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.prodConsumedService.setTableId(this.tableId);

    this.productService.fetchProducts();
    this.prodConsumedService.fetchProductsConsumed(this.tableId);

    this.initSubscriptions();
  }

  initSubscriptions() {
    let p = this.prodConsumedService
      .getProductsConsumed()
      .subscribe((prodConsumed: Array<ProductsConsumedDoc>) => {
        this.prodConsumed = prodConsumed[0];
      });
    this.subscriptions.push(p);

    let p2 = this.productService
      .getCurrentProducts()
      .subscribe((productsDoc: Array<ProductsDoc>) => {
        let products = productsDoc[0];
        this.visibleProducts = productsDoc;
      });
  }

  addProductToConsumed(p: Product) {
    //TODO: check stock > 0 ? change the quantity of that product in that list : add a new product to that list
  }
}
