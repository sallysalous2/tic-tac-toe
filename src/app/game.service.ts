import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { NamesDialogComponent } from './names-dialog/names-dialog.component';

interface gameData {
  firstPlayer: string;
  secondPlayer: string;
  boardSize: string;
  examination: string;
  navigateion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public board = new Array<any>();
  isGameRunning: boolean = false;
  firstPlayer: string = 'player 1';
  secondPlayer: string = 'player 2';
  boardSize: any = 0;
  examination: any = 0;
  playerOneMoves: any = [];
  playerTwoMoves: any = [];
  activePlayer: string = 'X';
  isGameOver: boolean = false;
  turnCount = 0;
  winner: boolean = false;
  allowRollBack: boolean = true;
  lastChangedId: any;
  public winningCombinations = new Array<any>();
  defaultBoardSize: number = 3;

  constructor(private dialog: MatDialog, private cookieService: CookieService) {
  }

  getCookieByKey(key: string) {
    return JSON.parse(this.cookieService.get(key));
  }

  setCookieByKey(key: string, value: any) {
    return this.cookieService.set(key, JSON.stringify(value), undefined, '', '', false, 'Lax');

  }

  existingGame() {
    // Get game status from local storage and show it on the board.
    const boardValue = this.getCookieByKey('board');
    const activePlayerValue = this.getCookieByKey('activePlayer');
    const isGameRunningValue = this.getCookieByKey('isGameRunning');
    const isGameOverValue = this.getCookieByKey('isGameOver');
    const turnCountValue = this.getCookieByKey('turnCount');
    const winnerValue = this.getCookieByKey('winner');
    const lastChangedIdValue = this.getCookieByKey('lastChangedId');
    const allowRollBackIdValue = this.cookieService.get('allowRollBack');
    const firstPlayerValue = this.getCookieByKey('firstPlayer');
    const secondPlayerValue = this.getCookieByKey('secondPlayer');
    const examination = this.getCookieByKey('examination');
    const boardSize = this.getCookieByKey('boardSize');
    const playerOneMoves = this.getCookieByKey('playerOneMoves');
    const playerTwoMoves = this.getCookieByKey('playerTwoMoves');

    this.board = boardValue || '';
    this.activePlayer = activePlayerValue || 'X';
    this.firstPlayer = firstPlayerValue || '';
    this.secondPlayer = secondPlayerValue || '';
    this.examination = examination || '';
    this.boardSize = boardSize || '';
    this.playerOneMoves = playerOneMoves || '';
    this.playerTwoMoves = playerTwoMoves || '';
    this.isGameRunning = isGameRunningValue === 'true';
    this.isGameOver = isGameOverValue === 'true';
    this.turnCount = parseInt(turnCountValue || 0, 10);
    this.lastChangedId = parseInt(lastChangedIdValue || 0, 10);
    this.winner = winnerValue === 'true' || winnerValue === true;
    this.allowRollBack = allowRollBackIdValue == 'true';
    this.defaultBoardSize = this.boardSize;
    this.setWinnerCombination();
  }

  newGame(){
    // Start a new game by always enter two players names and initialize the board.
    const dialogRef = this.dialog.open(NamesDialogComponent, {
      disableClose: true,
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((data: gameData) => {
      this.firstPlayer = data.firstPlayer;
      this.secondPlayer = data.secondPlayer;
      this.boardSize = data.boardSize;
      this.examination = data.examination;

      this.setCookieByKey('firstPlayer', this.firstPlayer);
      this.setCookieByKey('secondPlayer', this.secondPlayer);
      this.setCookieByKey('boardSize', this.boardSize);
      this.setCookieByKey('examination', this.examination);
      this.setCookieByKey('allowRollBack', this.allowRollBack);

      this.board = this.createBoard();
      this.setCookieByKey('board', this.board);
      this.setCookieByKey('activePlayer', 'X');
      this.setCookieByKey('playerOneMoves', []);
      this.setCookieByKey('playerTwoMoves', []);
      this.setCookieByKey('lastChangedId', 0);
      this.setCookieByKey('winner', false);
      this.setCookieByKey('isGameRunning', true);
      this.setCookieByKey('isGameOver', false);
      this.setCookieByKey('turnCount', 0);


      this.defaultBoardSize = this.boardSize;
      this.setWinnerCombination();

      if (data.navigateion === 'navigate') {
        this.dialog.closeAll();
      }
    });
    this.activePlayer = 'X';
    this.isGameRunning = false;
    this.isGameOver =  false;
    this.turnCount = 0;
    this.winner = false;
    this.allowRollBack = true;
    this.playerOneMoves = [];
    this.playerTwoMoves = [];
  }

  createBoard(){
    // Create dynamic squares with initial state value null.
    let board = [];
    for( let i = 0; i < this.boardSize * this.boardSize; i ++ ) {
      board.push({ id: i, state: null, winner: false });
    };

    return board
  } 

  get gameOver(): boolean {
    // Check if the game is over return true or false.
    return this.turnCount > this.boardSize * this.boardSize - 1 || this.winner ? true : false;
  }

  get isWinner(): boolean{
    // Check if there is a winner by checking columns, rows and Diagonals based on winningCombinations calculations.
    let win = false;
    let playerMoves = new Array();
    if (this.activePlayer === 'X') {
      playerMoves = this.playerOneMoves;
    } else {
      playerMoves = this.playerTwoMoves;
    }
    if (playerMoves.length >= this.examination) {
      for (let sets = 0; sets < this.winningCombinations.length; sets++) {
        let setWinner = this.winningCombinations[sets];
        let winnerFound = true;
        for (let row = 0; row < setWinner.length; row++) {
          let found = false;
          for (let i = 0; i < playerMoves.length; i++) {
            if (setWinner[row] == playerMoves[i]) {
              found = true;
              break;
            }
          }
          if (found == false) {
            winnerFound = false;
            break;
          }
        }
        if (winnerFound == true) {
          win = true;
          this.winningCombinations[sets].forEach((position: any) => {
            this.board[position].winner = true
          });
          break;
        }
      }
    }
    return win;
  }

  changePlayerTurn( squareClicked: any){
    // Change player turn when chlick on square and set local storage to preserve the game.
    this.updateBoard( squareClicked )
    if(!this.isGameOver) this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X';
    this.turnCount ++;

    this.setCookieByKey('board', this.board);
    this.setCookieByKey('activePlayer', this.activePlayer);
    this.setCookieByKey('isGameRunning', this.isGameRunning);
    this.setCookieByKey('playerTwoMoves', this.playerTwoMoves);
    this.setCookieByKey('isGameOver', this.isGameOver);
    this.setCookieByKey('turnCount', this.turnCount);
    this.setCookieByKey('winner', this.winner);
    this.setCookieByKey('lastChangedId', this.lastChangedId);
    this.setCookieByKey('playerOneMoves', this.playerOneMoves);

   }

  updateBoard( squareClicked: any ){
    // Update the board and set state value based on square clicked.
    this.lastChangedId = squareClicked.id;
    this.board[ squareClicked.id ].state = squareClicked.state;

    if (this.activePlayer === 'X') {
      this.playerOneMoves.push(squareClicked.id);
    } else {
      this.playerTwoMoves.push(squareClicked.id);
    }

    if (this.isWinner) {
       this.winner = true;
       this.isGameRunning = false;
       this.isGameOver = true;
    }
  }

  rollBack() {
    // Allow to roll back one time in the game.
    this.board[this.lastChangedId].state = null;
    this.allowRollBack = false;
    if (!this.isGameOver) {
      this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X';
    }

    this.setCookieByKey('activePlayer', this.activePlayer);
    this.setCookieByKey('board', this.board);
    this.setCookieByKey('allowRollBack', this.allowRollBack);

    if (this.activePlayer === 'X') {
      this.playerOneMoves.splice(this.playerOneMoves.length - 1, 1);
      this.setCookieByKey('playerOneMoves', this.playerOneMoves);
    } else {
      this.playerTwoMoves.splice(this.playerTwoMoves.length - 1, 1);
      this.setCookieByKey('playerTwoMoves', this.playerTwoMoves);
    }
  }

  setWinnerCombination() {
    let columnValue = 0;
    let diagonalValue = 0;
    this.winningCombinations = [];
    const examination = this.examination;

    for (let j = 0; j < this.defaultBoardSize; j++) {
      for (let mainIndex = j * this.defaultBoardSize; mainIndex <= (this.defaultBoardSize * (j + 1) - examination); mainIndex++) {

        let rows = [];
        for (let i = mainIndex; i < (mainIndex + examination); i++) {
          rows.push(i);
          if (i >= Math.pow(this.defaultBoardSize, 2)) {
            rows = [];
          }
        }
        if (rows.length) {
          this.winningCombinations.push(rows);
        }
        let columnIndex = [];
        let tempColumnValue = columnValue;
        for (let i = mainIndex; i < (mainIndex + examination); i++) {
          columnIndex.push(tempColumnValue);
          if (tempColumnValue >= Math.pow(this.defaultBoardSize, 2)) {
            columnIndex = [];
          }
          tempColumnValue += this.defaultBoardSize;
        }
        if (columnIndex.length) {
          this.winningCombinations.push(columnIndex);
        }
        columnValue++;

        let firstDiagonal = [];
        diagonalValue = mainIndex;
        for (let l = mainIndex; l < (mainIndex + examination); l++) {
          firstDiagonal.push(diagonalValue);
          if (diagonalValue >= Math.pow(this.defaultBoardSize, 2)) {
            firstDiagonal = [];
          }
          diagonalValue += this.defaultBoardSize + 1;
        }
        if (firstDiagonal.length) {
          this.winningCombinations.push(firstDiagonal);
        }
        let secondDiagonal = [];
        diagonalValue = examination + mainIndex - 1;
        for (let l = mainIndex; l < (mainIndex + examination); l++) {
          secondDiagonal.push(diagonalValue);
          if (diagonalValue >= Math.pow(this.defaultBoardSize, 2)) {
            secondDiagonal = [];
          }
          diagonalValue += this.defaultBoardSize - 1;
        }
        if (secondDiagonal.length) {
          this.winningCombinations.push(secondDiagonal);
        }
      }
    }
  }
  
}
