import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StartPositionCardComponent } from './start-position-card.component';

describe('StartPositionCardComponent', () => {
  let component: StartPositionCardComponent;
  let fixture: ComponentFixture<StartPositionCardComponent>;
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
      imports: [StartPositionCardComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(StartPositionCardComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.startPosition = { X: 0, Y: 0 };
    component.index = 0;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});