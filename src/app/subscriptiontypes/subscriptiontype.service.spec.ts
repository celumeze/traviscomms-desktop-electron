import { TestBed } from '@angular/core/testing';

import { SubscriptionTypeService } from './subscriptiontype.service';

describe('SubscriptiontypeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionTypeService = TestBed.get(SubscriptionTypeService);
    expect(service).toBeTruthy();
  });
});
