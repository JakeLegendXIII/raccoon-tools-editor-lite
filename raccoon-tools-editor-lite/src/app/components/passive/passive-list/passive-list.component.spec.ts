import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Passive } from '../../../models/passive.model';
import { addPassive, deletePassive, loadPassives, updatePassive } from '../../../store/passives.actions';
import { PassiveListComponent } from './passive-list.component';

describe('PassiveListComponent', () => {
  let component: PassiveListComponent;
  let fixture: ComponentFixture<PassiveListComponent>;
  let store: MockStore;

  const createPassive = (overrides: Partial<Passive> = {}): Passive => Object.assign(new Passive(), {
    ID: 1,
    Name: 'Quick Step',
    Description: 'Move again after attacking.',
    BonusMove: true,
    Amount: 2
  }, overrides);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassiveListComponent],
      providers: [provideMockStore({ initialState: { passive: { passives: [] } } })]
    }).compileComponents();

    fixture = TestBed.createComponent(PassiveListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders passive details and active effects', () => {
    store.setState({ passive: { passives: [createPassive()] } });
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Quick Step');
    expect(content).toContain('Move again after attacking.');
    expect(content).toContain('Bonus move');
    expect(content).toContain('2');
  });

  it('adds a passive with the next ID and opens it for editing', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    store.setState({ passive: { passives: [createPassive({ ID: 4 })] } });

    await component.addNewPassive();

    expect(dispatch).toHaveBeenCalledWith(addPassive({
      passive: expect.objectContaining({ ID: 5, Name: 'New Passive' }) as Passive
    }));
    expect(component.editingPassiveId).toBe(5);
    expect(component.editingPassive?.Name).toBe('New Passive');
  });

  it('saves a trimmed and normalized passive', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.startEditing(createPassive());
    component.editingPassive!.Name = '  Quick Step Plus  ';
    component.editingPassive!.Description = '  Improved movement.  ';
    component.editingPassive!.Amount = 2.6;

    component.savePassive();

    expect(dispatch).toHaveBeenCalledWith(updatePassive({
      passive: expect.objectContaining({
        ID: 1,
        Name: 'Quick Step Plus',
        Description: 'Improved movement.',
        Amount: 3
      }) as Passive
    }));
    expect(component.editingPassive).toBeNull();
    expect(component.editingPassiveId).toBeNull();
  });

  it('does not save a passive without a name', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.startEditing(createPassive({ Name: '   ' }));

    component.savePassive();

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Name is required.');
    expect(component.editingPassive).not.toBeNull();
  });

  it('deletes a confirmed passive and closes its editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));
    component.startEditing(createPassive({ ID: 7 }));

    component.deletePassiveById(7);

    expect(dispatch).toHaveBeenCalledWith(deletePassive({ passiveId: 7 }));
    expect(component.editingPassive).toBeNull();
  });

  it('imports a valid passive JSON file', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const passive = createPassive({ ID: 9, Name: 'Shadow Walk', Stealth: true });
    stubFileReader(JSON.stringify([passive]));
    const input = createFileInput('passives.json');

    component.onFileSelected({ target: input } as unknown as Event);

    expect(dispatch).toHaveBeenCalledWith(loadPassives({
      passives: [expect.objectContaining({ ID: 9, Name: 'Shadow Walk', Stealth: true }) as Passive]
    }));
    expect(component.errorMessage).toBe('');
    expect(input.value).toBe('');
  });

  it('rejects duplicate passive IDs during import', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const passive = createPassive({ ID: 3 });
    stubFileReader(JSON.stringify([passive, passive]));

    component.onFileSelected({ target: createFileInput('passives.json') } as unknown as Event);

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Duplicate passive ID 3.');
  });

  it('shows an error when exporting an empty passive list', () => {
    component.exportPassives();

    expect(component.errorMessage).toBe('Add or import at least one passive before exporting.');
  });

  it('exports passives as passives.json', () => {
    store.setState({ passive: { passives: [createPassive()] } });
    const createObjectURL = vi.fn(() => 'blob:passives');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', class extends URL {
      static override createObjectURL = createObjectURL;
      static override revokeObjectURL = revokeObjectURL;
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    component.exportPassives();

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect((click.mock.instances[0] as HTMLAnchorElement).download).toBe('passives.json');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:passives');
  });

  function createFileInput(name: string): HTMLInputElement {
    return {
      files: [new File([''], name, { type: 'application/json' })],
      value: name
    } as unknown as HTMLInputElement;
  }

  function stubFileReader(contents: string): void {
    class FileReaderStub {
      result: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      readAsText(): void {
        this.result = contents;
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', FileReaderStub);
  }
});