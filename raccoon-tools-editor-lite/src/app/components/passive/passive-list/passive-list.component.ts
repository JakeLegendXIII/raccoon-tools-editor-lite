import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, take } from 'rxjs';

import { Passive } from '../../../models/passive.model';
import { addPassive, deletePassive, loadPassives, updatePassive } from '../../../store/passives.actions';
import { selectPassives } from '../../../store/passives.selectors';

type PassiveFlag = keyof Pick<Passive, 'BonusAttack' | 'BonusMove' | 'BonusDamage' | 'BonusRange' | 'Stealth' | 'Diagonal'>;

@Component({
  selector: 'app-passive-list',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule],
  templateUrl: './passive-list.component.html',
  styleUrl: './passive-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class PassiveListComponent {
  private store = inject(Store);

  readonly passives$: Observable<Passive[]> = this.store.select(selectPassives);
  readonly flagOptions: { key: PassiveFlag; label: string }[] = [
    { key: 'BonusAttack', label: 'Bonus attack' },
    { key: 'BonusMove', label: 'Bonus move' },
    { key: 'BonusDamage', label: 'Bonus damage' },
    { key: 'BonusRange', label: 'Bonus range' },
    { key: 'Stealth', label: 'Stealth' },
    { key: 'Diagonal', label: 'Diagonal attack' }
  ];

  editingPassiveId: number | null = null;
  editingPassive: Passive | null = null;
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      this.errorMessage = 'Select a JSON file.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedData: unknown = JSON.parse(String(reader.result));
        const passives = this.deserializePassives(parsedData);
        this.store.dispatch(loadPassives({ passives }));
        this.cancelEditing();
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to import the JSON file.';
      }
    };
    reader.onerror = () => {
      this.errorMessage = `Unable to read ${file.name}.`;
    };
    reader.readAsText(file);
    input.value = '';
  }

  exportPassives(): void {
    this.passives$.pipe(take(1)).subscribe(passives => {
      if (passives.length === 0) {
        this.errorMessage = 'Add or import at least one passive before exporting.';
        return;
      }

      const blob = new Blob([JSON.stringify(passives, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'passives.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      this.errorMessage = '';
    });
  }

  async addNewPassive(): Promise<void> {
    const passives = await firstValueFrom(this.passives$);
    const passive = new Passive();
    passive.ID = passives.length === 0 ? 1 : Math.max(...passives.map(current => current.ID)) + 1;
    passive.Name = 'New Passive';
    this.store.dispatch(addPassive({ passive }));
    this.startEditing(passive);
    this.errorMessage = '';
  }

  startEditing(passive: Passive): void {
    this.editingPassiveId = passive.ID;
    this.editingPassive = { ...passive };
  }

  cancelEditing(): void {
    this.editingPassiveId = null;
    this.editingPassive = null;
  }

  savePassive(): void {
    if (!this.editingPassive) {
      return;
    }

    const name = this.editingPassive.Name.trim();
    if (!name) {
      this.errorMessage = 'Name is required.';
      return;
    }

    const passive = {
      ...this.editingPassive,
      Name: name,
      Description: this.editingPassive.Description.trim(),
      Amount: Math.round(Number(this.editingPassive.Amount) || 0)
    };
    this.store.dispatch(updatePassive({ passive }));
    this.cancelEditing();
    this.errorMessage = '';
  }

  deletePassiveById(passiveId: number): void {
    if (confirm('Delete this passive?')) {
      this.store.dispatch(deletePassive({ passiveId }));
      if (this.editingPassiveId === passiveId) {
        this.cancelEditing();
      }
    }
  }

  isEditing(passiveId: number): boolean {
    return this.editingPassiveId === passiveId;
  }

  activeFlags(passive: Passive): string[] {
    return this.flagOptions
      .filter(option => passive[option.key])
      .map(option => option.label);
  }

  private deserializePassives(data: unknown): Passive[] {
    if (!Array.isArray(data)) {
      throw new Error('Invalid passive file: expected an array.');
    }

    const ids = new Set<number>();
    return data.map((value, index) => {
      if (!this.isPassiveRecord(value)) {
        throw new Error(`Invalid passive at position ${index + 1}.`);
      }

      if (ids.has(value.ID)) {
        throw new Error(`Duplicate passive ID ${value.ID}.`);
      }
      ids.add(value.ID);

      return Object.assign(new Passive(), value);
    });
  }

  private isPassiveRecord(value: unknown): value is Passive {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const passive = value as Record<keyof Passive, unknown>;
    return Number.isInteger(passive.ID)
      && (passive.ID as number) >= 0
      && typeof passive.Name === 'string'
      && typeof passive.Description === 'string'
      && typeof passive.Amount === 'number'
      && Number.isInteger(passive.Amount)
      && this.flagOptions.every(option => typeof passive[option.key] === 'boolean');
  }
}