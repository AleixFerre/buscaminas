import { Component, Input, OnInit } from '@angular/core';
import { Coords, GameStatus } from './board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() boardSize!: number;

  matrix: number[][] = [];
  clicked: boolean[][] = [];
  flag: boolean[][] = [];
  status: GameStatus = GameStatus.Playing;
  isFirstTurn = true;
  bombsCoords: Coords[] = [];

  GameStatus = GameStatus;

  ngOnInit(): void {
    this.startGame();
  }

  private startGame() {
    this.createMatrix();
  }

  private createMatrix() {
    for (let i: number = 0; i < this.boardSize; i++) {
      this.matrix[i] = [];
      this.clicked[i] = [];
      this.flag[i] = [];
      for (let j: number = 0; j < this.boardSize; j++) {
        this.matrix[i][j] = 0;
        this.clicked[i][j] = false;
        this.flag[i][j] = false;
      }
    }
  }

  private placeBombs(avoidX: number, avoidY: number) {
    this.bombsCoords = [];
    for (let i: number = 0; i < this.boardSize; i++) {
      const coords = this.getRandomPositionAvoiding(
        avoidX,
        avoidY,
        this.bombsCoords
      );
      this.bombsCoords.push(coords);
      this.matrix[coords.x][coords.y] = -1;
    }
  }

  private getRandomPositionAvoiding(
    avoidX: number,
    avoidY: number,
    currentBombs: Coords[]
  ): Coords {
    let [x, y] = [-1, -1];
    do {
      x = Math.floor(Math.random() * this.boardSize);
      y = Math.floor(Math.random() * this.boardSize);
    } while ((x === avoidX && y === avoidY) || currentBombs.includes({ x, y }));
    return { x, y };
  }

  private calculateNumbers() {
    for (let i: number = 0; i < this.boardSize; i++) {
      for (let j: number = 0; j < this.boardSize; j++) {
        if (this.matrix[i][j] !== -1) {
          this.matrix[i][j] = this.calculateCircundant(i, j);
        }
      }
    }
  }

  private calculateCircundant(x: number, y: number): number {
    let nBombs = 0;
    const [startX, endX, startY, endY] = this.calculateLimits(x, y);

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        if (this.matrix[i][j] === -1) {
          nBombs++;
        }
      }
    }
    return nBombs;
  }

  private calculateLimits(x: number, y: number) {
    const limits = [x - 1, x + 1, y - 1, y + 1];
    return limits.map((n) => Math.min(Math.max(n, 0), this.boardSize - 1));
  }

  public toggleFlag(x: number, y: number, event: Event) {
    event.preventDefault();
    if (this.status !== GameStatus.Playing) {
      return;
    }

    this.flag[x][y] = !this.flag[x][y];
  }

  public clickPos(x: number, y: number) {
    if (this.status !== GameStatus.Playing) {
      return;
    }

    if (this.flag[x][y]) {
      return;
    }

    if (this.isFirstTurn) {
      this.placeBombs(x, y);
      this.calculateNumbers();
      this.isFirstTurn = false;
    }

    if (this.matrix[x][y] === -1) {
      this.showBombs();
      this.gameOver();
      return;
    }

    this.clickPosRecursive(x, y);

    if (this.checkWin()) {
      this.showBombs();
      this.status = GameStatus.Win;
    }
  }

  private showBombs() {
    this.bombsCoords.forEach((coords) => {
      if (this.matrix[coords.x][coords.y] === -1) {
        this.clicked[coords.x][coords.y] = true;
      }
    });
  }

  public clickPosRecursive(x: number, y: number) {
    if (this.clicked[x][y]) {
      return;
    }

    this.clicked[x][y] = true;



    if (this.matrix[x][y] !== 0) {
      return;
    }

    const [startX, endX, startY, endY] = this.calculateLimits(x, y);

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        this.clickPosRecursive(i, j);
      }
    }
  }

  private gameOver() {
    this.status = GameStatus.GameOver;
  }

  public restart() {
    this.matrix = [];
    this.clicked = [];
    this.flag = [];
    this.startGame();
    this.isFirstTurn = true;
    this.status = GameStatus.Playing;
  }

  private checkWin(): boolean {
    for (let i: number = 0; i < this.boardSize; i++) {
      for (let j: number = 0; j < this.boardSize; j++) {
        if (this.matrix[i][j] !== -1 && !this.clicked[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}
