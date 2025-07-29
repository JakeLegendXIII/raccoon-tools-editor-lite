import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionComponent } from './conversion.component';

describe('ConversionComponent', () => {
  let component: ConversionComponent;
  let fixture: ComponentFixture<ConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert ounces to milliliters correctly', () => {
    component.beforeOunces = 1;
    expect(component.beforeML).toBeCloseTo(29.5735, 4);
    
    component.afterOunces = 2;
    expect(component.afterML).toBeCloseTo(59.147, 4);

    expect(component.differenceML).toBeCloseTo(29.5735, 4);
  });

  it('should handle early base case correctly', () => {
    component.beforeOunces = 95.23
    component.afterOunces = 96.47;

    expect(component.beforeML).toBeCloseTo(2816.28, 1);
    expect(component.afterML).toBeCloseTo(2852.96, 1);
    expect(component.differenceML).toBeCloseTo(36.67, 1);
  });
});
