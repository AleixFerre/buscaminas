import { Component, OnInit } from '@angular/core';
import { GameStatus } from './board.model';

const MATRIX_SIZE = 10;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  matrix: number[][] = [];
  clicked: boolean[][] = [];
  flag: boolean[][] = [];
  status: GameStatus = GameStatus.Playing;

  GameStatus = GameStatus;

  ngOnInit(): void {
    this.startGame();
  }

  private startGame() {
    this.createMatrix();
    this.placeBombs();
    this.calculateNumbers();
  }

  private createMatrix() {
    for (let i: number = 0; i < MATRIX_SIZE; i++) {
      this.matrix[i] = [];
      this.clicked[i] = [];
      this.flag[i] = [];
      for (let j: number = 0; j < MATRIX_SIZE; j++) {
        this.matrix[i][j] = 0;
        this.clicked[i][j] = false;
        this.flag[i][j] = false;
      }
    }
  }

  private placeBombs() {
    for (let i: number = 0; i < MATRIX_SIZE; i++) {
      let x = Math.floor(Math.random() * MATRIX_SIZE);
      let y = Math.floor(Math.random() * MATRIX_SIZE);
      this.matrix[x][y] = -1;
    }
  }

  private calculateNumbers() {
    for (let i: number = 0; i < MATRIX_SIZE; i++) {
      for (let j: number = 0; j < MATRIX_SIZE; j++) {
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
    return limits.map((n) => Math.min(Math.max(n, 0), MATRIX_SIZE - 1));
  }

  public clickPos(x: number, y: number) {
    if (this.status === GameStatus.GameOver) {
      return;
    }

    if (this.flag[x][y]) {
      return;
    }

    this.clickPosRecursive(x, y);
  }

  public toggleFlag(x: number, y: number, event: Event) {
    event.preventDefault();
    this.flag[x][y] = !this.flag[x][y];
  }

  public clickPosRecursive(x: number, y: number) {
    if (this.clicked[x][y]) {
      return;
    }

    this.clicked[x][y] = true;

    if (this.matrix[x][y] === -1) {
      this.gameOver();
      return;
    }

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
    this.status = GameStatus.Playing;
  }
}