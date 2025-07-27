import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-conversion',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss',
  standalone: true
})
export class ConversionComponent {
  beforeOunces: number = 0;
  afterOunces: number = 0;
  
  // Conversion factor: 1 ounce = 29.5735 milliliters
  private readonly OUNCES_TO_ML = 29.5735;

  get beforeML(): number {
    return this.beforeOunces * this.OUNCES_TO_ML;
  }

  get afterML(): number {
    return this.afterOunces * this.OUNCES_TO_ML;
  }

  get differenceML(): number {
    return this.afterML - this.beforeML;
  }

  get absDifferenceML(): number {
    return Math.abs(this.differenceML);
  }

  get isIncrease(): boolean {
    return this.differenceML > 0;
  }

  get isDecrease(): boolean {
    return this.differenceML < 0;
  }

  get noChange(): boolean {
    return this.differenceML === 0;
  }

  onBeforeOuncesChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.beforeOunces = parseFloat(target.value) || 0;
  }

  onAfterOuncesChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.afterOunces = parseFloat(target.value) || 0;
  }

  reset(): void {
    this.beforeOunces = 0;
    this.afterOunces = 0;
  }
}
