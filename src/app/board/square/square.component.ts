import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../game.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class SquareComponent implements OnInit {

  @Input() square: any;

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

  changePlayer() {
    // Call change player turn when square clicked.
    this.gameService.isGameRunning = true;
    if ( this.gameService.isGameRunning && this.square.state === null ){
      this.square.state =  this.gameService.activePlayer;
      this.gameService.changePlayerTurn( this.square);
    }
  }

}
