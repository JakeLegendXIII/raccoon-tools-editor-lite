import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportComponent } from '../import/import.component';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let dialog: { open: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialog = { open: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the File and Tools menu triggers', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('.nav-button')) as HTMLButtonElement[];

    expect(buttons).toHaveLength(2);
    expect(buttons.map(button => button.textContent?.trim())).toEqual([
      expect.stringContaining('File'),
      expect.stringContaining('Tools')
    ]);
  });

  it('opens the import dialog with responsive sizing', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(undefined) });

    component.openImportDialog();

    expect(dialog.open).toHaveBeenCalledWith(ImportComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)'
    });
  });

  it('handles a result returned by the import dialog', () => {
    const result = { type: 'level', data: [{ ID: 4 }] };
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    dialog.open.mockReturnValue({ afterClosed: () => of(result) });

    component.openImportDialog();

    expect(consoleLog).toHaveBeenCalledWith('Import dialog closed with result:', result);
  });

  it('navigates to each available menu destination', () => {
    component.navigateToLevelEditor();
    component.navigateToExport();
    component.navigateToItemList();
    component.navigateToPassiveList();
    component.navigateToConversion();

    expect(router.navigate).toHaveBeenNthCalledWith(1, ['/level-editor']);
    expect(router.navigate).toHaveBeenNthCalledWith(2, ['/export']);
    expect(router.navigate).toHaveBeenNthCalledWith(3, ['/items']);
    expect(router.navigate).toHaveBeenNthCalledWith(4, ['/passives']);
    expect(router.navigate).toHaveBeenNthCalledWith(5, ['/conversion']);
  });
});