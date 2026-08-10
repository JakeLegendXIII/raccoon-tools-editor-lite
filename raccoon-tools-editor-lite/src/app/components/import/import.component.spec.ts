import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BaseEnemyType,
  BasePlayerType,
  BiomeType,
  Level,
  LevelType,
  ObstacleType
} from '../../models/level.model';
import { loadLevels } from '../../store/level.actions';
import { ImportComponent } from './import.component';

describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let store: MockStore;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ImportComponent],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportComponent);
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

  it('accepts multiple valid JSON level files', async () => {
    stubFileReader([
      JSON.stringify({ ID: 2 }),
      JSON.stringify({ ID: 3 })
    ]);

    component.onFileSelected(createFileEvent([
      createFile('level-2.json'),
      createFile('level-3.json')
    ]));

    await vi.waitFor(() => expect(component.isValidJson).toBe(true));
    expect(component.selectedFiles).toHaveLength(2);
    expect(component.fileContents).toHaveLength(2);
    expect(component.getSelectedFileLabel()).toBe('2 files selected');
    expect(component.errorMessage).toBe('');
  });

  it('rejects a file without a JSON extension or content type', () => {
    component.onFileSelected(createFileEvent([
      createFile('level.txt', 'text/plain')
    ]));

    expect(component.errorMessage).toBe('Please select a valid JSON file');
    expect(component.selectedFiles).toEqual([]);
    expect(component.fileContents).toEqual([]);
    expect(component.isValidJson).toBe(false);
  });

  it('rejects malformed JSON', async () => {
    stubFileReader(['not valid JSON']);

    component.onFileSelected(createFileEvent([createFile('broken.json')]));

    await vi.waitFor(() => expect(component.errorMessage).toBe('Invalid JSON format'));
    expect(component.fileContents).toEqual([]);
    expect(component.isValidJson).toBe(false);
  });

  it('rejects a JSON value that is not a level object', async () => {
    stubFileReader([JSON.stringify([{ ID: 1 }])]);

    component.onFileSelected(createFileEvent([createFile('levels.json')]));

    await vi.waitFor(() => expect(component.errorMessage).toBe('Invalid level data format'));
    expect(component.isValidJson).toBe(false);
  });

  it('sanitizes imported level data before dispatching it', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const levelData = {
      ID: 60000,
      GridWidth: 12,
      GridHeight: 8,
      CellSize: 500,
      LevelType: 999,
      LevelDescription: '  Test level  ',
      BiomeType: BiomeType.Tundra,
      NumberOfTurns: 12000,
      WinPosition: { X: 99, Y: -5 },
      Players: [{
        ID: -2,
        PlayerType: BasePlayerType.Fighter,
        Health: 12000,
        Height: 0,
        Width: 150,
        StartPosition: { X: 4, Y: 20 }
      }],
      Enemies: [{
        ID: 8,
        EnemyType: BaseEnemyType.Boss,
        Health: 25,
        Height: 2,
        Width: 2,
        StartPosition: { X: 3, Y: 4 }
      }],
      Obstacles: [{
        ID: 9,
        Health: 10,
        Height: 1,
        Width: 1,
        ObstacleType: ObstacleType.Wall,
        IsWalkable: 'true',
        IsDestructible: 'false',
        IsInteractive: true,
        Position: { X: 7, Y: 6 }
      }],
      StartPositionsList: [{ X: -1, Y: 50 }]
    };
    stubFileReader([JSON.stringify(levelData)]);

    component.onFileSelected(createFileEvent([createFile('level.json')]));
    await vi.waitFor(() => expect(component.isValidJson).toBe(true));
    component.onImport();

    const expectedLevel = expect.objectContaining({
      ID: 50000,
      GridWidth: 12,
      GridHeight: 8,
      CellSize: 256,
      LevelType: LevelType.Deathmatch,
      LevelDescription: 'Test level',
      BiomeType: BiomeType.Tundra,
      NumberOfTurns: 9999,
      WinPosition: expect.objectContaining({ X: 11, Y: 0 }),
      Players: [expect.objectContaining({
        ID: 0,
        PlayerType: BasePlayerType.Fighter,
        Health: 9999,
        Height: 1,
        Width: 100,
        StartPosition: expect.objectContaining({ X: 4, Y: 7 })
      })],
      Enemies: [expect.objectContaining({
        ID: 8,
        EnemyType: BaseEnemyType.Boss,
        StartPosition: expect.objectContaining({ X: 3, Y: 4 })
      })],
      Obstacles: [expect.objectContaining({
        ID: 9,
        ObstacleType: ObstacleType.Wall,
        IsWalkable: true,
        IsDestructible: false,
        IsInteractive: true,
        Position: expect.objectContaining({ X: 7, Y: 6 })
      })],
      StartPositionsList: [expect.objectContaining({ X: 0, Y: 7 })]
    });

    expect(dispatch).toHaveBeenCalledWith(loadLevels({
      levels: [expectedLevel as unknown as Level]
    }));
    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'level',
      data: [expectedLevel]
    });
  });

  it('does not dispatch malformed entity collections', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    component.isValidJson = true;
    component.fileContents = [JSON.stringify({ Players: {} })];

    component.onImport();

    expect(dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Failed to import level data');
  });

  it('returns the selected file name and closes when cancelled', () => {
    component.selectedFiles = [createFile('campaign-level.json')];

    expect(component.getSelectedFileLabel()).toBe('campaign-level.json');
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalledOnce();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  function createFile(name: string, type: string = 'application/json'): File {
    return new File([''], name, { type });
  }

  function createFileEvent(files: File[]): Event {
    return { target: { files } } as unknown as Event;
  }

  function stubFileReader(contents: string[]): void {
    const pendingContents = [...contents];

    class FileReaderStub {
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      onerror: (() => void) | null = null;

      readAsText(): void {
        const result = pendingContents.shift();
        this.onload?.({ target: { result } } as unknown as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal('FileReader', FileReaderStub);
  }
});