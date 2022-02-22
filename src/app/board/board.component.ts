import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  previousUrl: string = '';
  constructor(public gameService: GameService, private cookieService: CookieService) {}

  ngOnInit(): void {
    // Check if there is a game running or a game result to show it or to start a new game.
    var boardValue = this.cookieService.get('board');
    if (boardValue && boardValue !== 'null') {
      this.gameService.existingGame();
    } else {
      this.gameService.newGame();
    }
  }

  resetGame(){
    // Reset the game and set local storage nulls.
    this.gameService.newGame();
    const keysToClear = ['board', 'activePlayer', 'isGameRunning', 'isGameOver', 'turnCount', 'winner', 'lastChangedId', 'allowRollBack', 'firstPlayer', 'secondPlayer']
    keysToClear.forEach(element => 
      this.cookieService.set(element, JSON.stringify(null), -1, '', '', false, "Lax")
    );
  }

}
