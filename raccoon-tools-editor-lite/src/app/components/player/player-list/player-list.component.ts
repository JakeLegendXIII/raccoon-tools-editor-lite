import { Component } from '@angular/core';
import { PlayerCardComponent } from "../player-card/player-card.component";

@Component({
  selector: 'app-player-list',
  imports: [PlayerCardComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {

}
