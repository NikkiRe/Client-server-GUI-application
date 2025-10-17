import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import axios from 'axios';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    standalone: true,
    imports: [CardModule, TableModule, ButtonModule, PanelModule, DropdownModule, CommonModule, 
        SliderModule, FormsModule]
})
export class MainPageComponent implements OnInit {
  data: any[] = [];

  xValue: number = 0;
  yValue: number = 0;
  rValue: number = 1;
    errorMessage: string = '';
  
  private router = inject(Router);
  id = sessionStorage.getItem('id');
  token = sessionStorage.getItem('token');

  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;

  ngAfterViewInit() {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.canvas.nativeElement.addEventListener('click', this.getClickPosition.bind(this));
    }
    this.drawOnCanvas();
  }

  async drawOnCanvas() {
    if (!this.ctx || !this.canvas)
        if (this.canvas) {
            this.ctx = this.canvas.nativeElement.getContext('2d');
            this.canvas.nativeElement.addEventListener('click', this.getClickPosition.bind(this));
        }
    if (!this.ctx || !this.canvas)
        return;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    const centerX = width / 2;
    const centerY = height / 2;

    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = 'rgb(118, 176, 242)';
    let squareX = centerX;
    let squareY = centerY;
    let squareSize = -this.rValue / 10 * width; 
    this.ctx.fillRect(squareX, squareY, squareSize, squareSize)
    let circleRadius = (this.rValue / 5) * width;
    if (this.rValue < 0) {
        circleRadius = - circleRadius
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, circleRadius / 2, 1 * Math.PI, 0.5 * Math.PI, true);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.closePath();
        this.ctx.fill();
    }
    else {
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, circleRadius / 2, 1.5 * Math.PI, 0, false);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.closePath();
        this.ctx.fill();
    }
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(centerX - squareSize / 2, centerY);
    this.ctx.lineTo(centerX, centerY - squareSize);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(width-5, centerY);
    this.ctx.moveTo(centerX, 5);
    this.ctx.lineTo(centerX, height);
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    const axisArrowSize = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(width - axisArrowSize, centerY - axisArrowSize/ 2);
    this.ctx.lineTo(width, centerY);
    this.ctx.lineTo(width - axisArrowSize, centerY + axisArrowSize / 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - axisArrowSize / 2, axisArrowSize);
    this.ctx.lineTo(centerX, 0);
    this.ctx.lineTo(centerX + axisArrowSize / 2, axisArrowSize);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    const labels = [-5, -2.5, 2.5];
    labels.forEach((label) => {
        const xPosition = centerX + label * 50;
        if (label !== 0) {
            if(!this.ctx) return;
            this.ctx.fillText(label.toString(), xPosition, centerY + 15);
            this.ctx.beginPath();
            this.ctx.moveTo(xPosition, centerY + 5);
            this.ctx.lineTo(xPosition, centerY - 5);
            this.ctx.stroke();
        }
    });
    labels.forEach((label) => {
        const yPosition = centerY - label * 50;
        if (label !== 0) {
            if(!this.ctx) return;
            this.ctx.fillText(label.toString(), centerX + 5, yPosition);
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 5, yPosition);
            this.ctx.lineTo(centerX + 5, yPosition);
            this.ctx.stroke();
        }
    });

    this.data.forEach((point) => {
        if(!this.ctx) return;
        const x = centerX + point.x * 50;
        const y = centerY - point.y * 50;
        this.ctx.fillStyle = point.result ? '#49e400' : 'red';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fill();
    });
  }

  getClickPosition(event: MouseEvent) {
    if (!this.canvas) return;
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left - width / 2) / 50;
    const y = -(event.clientY - rect.top - height / 2) / 50;
    this.sendPoint(x, y, this.rValue);
  }

    async ngOnInit() {
        this.getPoints();
        this.drawOnCanvas();
    }

    async sendPointButton() {
        if (this.yValue < -5 || this.yValue > 3)
            this.errorMessage = 'Значение y должно быть больше -5 и меньше 3!';
        else
            this.errorMessage = '';
        this.sendPoint(this.xValue, this.yValue, this.rValue);
    }

    async clearHistory() {
        const response = await axios.get('http://localhost:8080/web_4th_lab-1.0/rest/pointChecker/clearPointsHistory', {
            params: {
                id: this.id,
                token: this.token,
            },
        });
        if (response.status === 200) {
            this.data = [];
            this.drawOnCanvas();
        }

    }

    async deleteAccount() {
        const response = await axios.get('http://localhost:8080/web_4th_lab-1.0/rest/pointChecker/deleteUser', {
            params: {
                id: this.id,
                token: this.token,
            },
        });
        if (response.status === 200) {
            if(response.data !== "") {
                this.logOut();
            }
        }
    }

    async sendPoint(x: number, y: number, r: number) {
        const response = await axios.get(`http://localhost:8080/web_4th_lab-1.0/rest/pointChecker/checkPoint`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params:{
                x_cord: x,
                y_cord: y,
                radius: r,
                id: this.id,
                token: this.token,
            }
        });
        if (response.status === 200) {
            if(response.data !== "") {
                this.getPoints();
            }
        }
    }

  async getPoints() {
    const response = await axios.get('http://localhost:8080/web_4th_lab-1.0/rest/pointChecker/getPoints', {
        params: {
            id: this.id,
            token: this.token,
        },
    });

    if (response.status === 200) {
        if(response.data !== "") {
            let k = 1
            interface Point {
                id: number;
                x: number;
                y: number;
                radius: number;
                requestTime: string;
                executionTime: number;
                result: boolean;
              }
              
              const pointsData: Point[] = response.data.trim().split('\n').map((line: string): Point => {
                const [xCord, yCord, radius, requestTime, executionTime, result] = line.split('%');
                
                return {
                  id: k++,
                  x: parseFloat(xCord),
                  y: parseFloat(yCord),
                  radius: parseFloat(radius),
                  requestTime,
                  executionTime: parseFloat(executionTime),
                  result: result === 'true',
                };
              });

            this.data = pointsData;
            this.drawOnCanvas();
        }
    } else {
        console.error('Failed to fetch points:', response.status);
    }
  }

  logOut() {
    sessionStorage.removeItem('id'); // Удаляем id
    sessionStorage.removeItem('token'); // Удаляем токен
    this.router.navigate(['/']); // Перенаправляем на главную страницу (AuthComponent)
  }
}
