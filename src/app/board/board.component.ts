import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  matrix: number[][] = [];
  canShow: boolean[][] = [];

  ngOnInit(): void {
    this.createMatrix();
    this.placeBombs();
    this.calculateNumbers();
  }

  private createMatrix() {
    for (let i: number = 0; i < 10; i++) {
      this.matrix[i] = [];
      this.canShow[i] = [];
      for (let j: number = 0; j < 10; j++) {
        this.matrix[i][j] = 0;
        this.canShow[i][j] = false;
      }
    }
  }

  private placeBombs() {
    for (let i: number = 0; i < 10; i++) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      this.matrix[x][y] = -1;
    }
  }

  private calculateNumbers() {
    for (let i: number = 0; i < 10; i++) {
      for (let j: number = 0; j < 10; j++) {
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
    return limits.map((n) => Math.min(Math.max(n, 0), this.matrix.length - 1));
  }

  public clickPos(i:number, j:number) {
    this.canShow[i][j] = true;
  }
}
