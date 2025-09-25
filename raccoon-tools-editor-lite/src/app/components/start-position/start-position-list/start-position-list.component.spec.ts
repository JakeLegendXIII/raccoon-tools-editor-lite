import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPositionListComponent } from './start-position-list.component';

describe('StartPositionListComponent', () => {
  let component: StartPositionListComponent;
  let fixture: ComponentFixture<StartPositionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPositionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
