import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StartPositionListComponent } from './start-position-list.component';

describe('StartPositionListComponent', () => {
  let component: StartPositionListComponent;
  let fixture: ComponentFixture<StartPositionListComponent>;
  let store: MockStore;

  const initialState = {
    level: {
      currentLevel: {
        ID: 0,
        GridWidth: 8,
        GridHeight: 8,
        CellSize: 64,
        LevelType: 0,
        LevelDescription: '',
        NumberOfTurns: 0,
        WinPosition: { X: 0, Y: 0 },
        StartPositionsList: [],
        Players: [],
        Enemies: [],
        Obstacles: []
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPositionListComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(StartPositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});