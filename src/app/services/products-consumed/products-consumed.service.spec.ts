import { TestBed } from '@angular/core/testing';

import { ProductsConsumedService } from './products-consumed.service';

describe('ProductsConsumedService', () => {
  let service: ProductsConsumedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsConsumedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
