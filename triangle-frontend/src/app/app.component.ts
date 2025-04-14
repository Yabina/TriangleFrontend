import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'triangle-frontend';
  side1: number = 0;
  side2: number = 0;
  side3: number = 0;
  triangleType: string = '';

  constructor(private http: HttpClient) {}

    getTriangleType() {
    const url = `https://triangle-middleware-app-production.up.railway.app/triangle/type?side1=${this.side1}&side2=${this.side2}&side3=${this.side3}`;
    this.http.post(url, '', { responseType: 'text' }).subscribe({
      next: (response) => {
        this.triangleType = response; // Set the response directly to triangleType
      },
      error: (err) => {
        console.error('Error fetching triangle type:', err);
        this.triangleType = 'Error determining triangle type';
      }
    });
  }
}