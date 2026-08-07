import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { PassiveListComponent } from './passive-list.component';

describe('PassiveListComponent', () => {
  let component: PassiveListComponent;
  let fixture: ComponentFixture<PassiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassiveListComponent],
      providers: [provideMockStore({ initialState: { passive: { passives: [] } } })]
    }).compileComponents();

    fixture = TestBed.createComponent(PassiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});