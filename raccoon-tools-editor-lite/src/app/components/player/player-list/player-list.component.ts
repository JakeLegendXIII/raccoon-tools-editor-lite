import { Component } from '@angular/core';
import { PlayerCardComponent } from "../player-card/player-card.component";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PlayerData } from '../../../models/level.model';
import { selectPlayers } from '../../../store/level.selectors';
import { addPlayer } from '../../../store/level.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-player-list',
  imports: [PlayerCardComponent, CommonModule, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  players$: Observable<PlayerData[]>;

  constructor(private store: Store) {
    this.players$ = this.store.select(selectPlayers);
  }

  addNewPlayer(): void {
    const newPlayer = new PlayerData();
    // Generate a unique ID (simple approach)
    newPlayer.ID = Date.now();
    newPlayer.PlayerType = 1;
    newPlayer.Health = 100;
    newPlayer.Height = 32;
    newPlayer.Width = 32;
    
    this.store.dispatch(addPlayer({ player: newPlayer }));
  }
}
