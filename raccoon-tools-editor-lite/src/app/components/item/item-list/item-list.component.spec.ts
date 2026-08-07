import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Item, ItemType, TargetType } from '../../../models/item.model';
import { addItem, deleteItem, loadItems, updateItem } from '../../../store/items.actions';
import { ItemListComponent } from './item-list.component';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let store: MockStore;

  const createItem = (overrides: Partial<Item> = {}): Item => Object.assign(new Item(), {
    ID: 1,
    Name: 'Pulse Bomb',
    Description: 'Damages enemies in an area.',
    ChangeValue: 4,
    ItemType: ItemType.Attack,
    UseCount: 2,
    TargetRange: 1,
    TargetType: TargetType.Area,
    UsageRange: 5
  }, overrides);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListComponent],
      providers: [provideMockStore({ initialState: { item: { items: [] } } })]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
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

  it('renders item details and type labels', () => {
    store.setState({ item: { items: [createItem()] } });
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Pulse Bomb');
    expect(content).toContain('Damages enemies in an area.');
    expect(content).toContain('Attack');
    expect(content).toContain('Area');
    expect(content).toContain('5');
  });

  it('adds an item with the next ID and opens it for editing', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    store.setState({ item: { items: [createItem({ ID: 6 })] } });

    await component.addNewItem();

    expect(dispatch).toHaveBeenCalledWith(addItem({
      item: expect.objectContaining({ ID: 7, Name: 'New Item' }) as Item
    }));
    expect(component.editingItemId).toBe(7);
    expect(component.editingItem?.Name).toBe('New Item');
  });

  it('saves a trimmed item with normalized numeric values', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.startEditing(createItem());
    component.editingItem!.Name = '  Pulse Bomb Plus  ';
    component.editingItem!.Description = '  Improved damage.  ';
    component.editingItem!.ChangeValue = 4.6;
    component.editingItem!.UseCount = 0;
    component.editingItem!.TargetRange = -2;
    component.editingItem!.UsageRange = 5.7;

    component.saveItem();

    expect(dispatch).toHaveBeenCalledWith(updateItem({
      item: expect.objectContaining({
        ID: 1,
        Name: 'Pulse Bomb Plus',
        Description: 'Improved damage.',
        ChangeValue: 5,
        UseCount: 1,
        TargetRange: 0,
        UsageRange: 6
      }) as Item
    }));
    expect(component.editingItem).toBeNull();
    expect(component.editingItemId).toBeNull();
  });

  it('does not save an item without a name', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.startEditing(createItem({ Name: '   ' }));

    component.saveItem();

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Name is required.');
    expect(component.editingItem).not.toBeNull();
  });

  it('deletes a confirmed item and closes its editor', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    vi.stubGlobal('confirm', vi.fn(() => true));
    component.startEditing(createItem({ ID: 8 }));

    component.deleteItemById(8);

    expect(dispatch).toHaveBeenCalledWith(deleteItem({ itemId: 8 }));
    expect(component.editingItem).toBeNull();
  });

  it('imports a valid item JSON file', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const item = createItem({ ID: 9, Name: 'Med Kit', ItemType: ItemType.Heal, TargetType: TargetType.Ally });
    stubFileReader(JSON.stringify([item]));
    const input = createFileInput('items.json');

    component.onFileSelected({ target: input } as unknown as Event);

    expect(dispatch).toHaveBeenCalledWith(loadItems({
      items: [expect.objectContaining({
        ID: 9,
        Name: 'Med Kit',
        ItemType: ItemType.Heal,
        TargetType: TargetType.Ally
      }) as Item]
    }));
    expect(component.errorMessage).toBe('');
    expect(input.value).toBe('');
  });

  it('rejects duplicate item IDs during import', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const item = createItem({ ID: 3 });
    stubFileReader(JSON.stringify([item, item]));

    component.onFileSelected({ target: createFileInput('items.json') } as unknown as Event);

    expect(dispatch).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Duplicate item ID 3.');
  });

  it('shows an error when exporting an empty item list', () => {
    component.exportItems();

    expect(component.errorMessage).toBe('Add or import at least one item before exporting.');
  });

  it('exports items as items.json', () => {
    store.setState({ item: { items: [createItem()] } });
    const createObjectURL = vi.fn(() => 'blob:items');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', class extends URL {
      static override createObjectURL = createObjectURL;
      static override revokeObjectURL = revokeObjectURL;
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    component.exportItems();

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect((click.mock.instances[0] as HTMLAnchorElement).download).toBe('items.json');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:items');
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
