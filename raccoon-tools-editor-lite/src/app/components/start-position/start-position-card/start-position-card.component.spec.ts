import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPositionCardComponent } from './start-position-card.component';

describe('StartPositionCardComponent', () => {
  let component: StartPositionCardComponent;
  let fixture: ComponentFixture<StartPositionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPositionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPositionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
