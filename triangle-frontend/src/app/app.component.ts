import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface QuadResponse {
  sideA: number;
  sideB: number;
  sideC: number;
  sideD: number;
  type: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Triangle properties
  title = 'triangle-frontend';
  side1: number = 0;
  side2: number = 0;
  side3: number = 0;
  triangleType: string = '';

  @ViewChild('triangleCanvas', { static: false }) triangleCanvas!: ElementRef<HTMLCanvasElement>;

  // Quadrilateral properties
  title2 = 'quadrilateral-frontend';
  sideA: number | null = null;
  sideB: number | null = null;
  sideC: number | null = null;
  sideD: number | null = null;
  responseStatus: number | null = null;
  quadrilateralResponse: QuadResponse | { error: string } | null = null;


  constructor(private http: HttpClient) {}

    getTriangleType() {
    const url = `https://triangle-middleware-app-production.up.railway.app/triangle/type?side1=${this.side1}&side2=${this.side2}&side3=${this.side3}`;
    this.http.post(url, '', { responseType: 'text' }).subscribe({
      next: (response) => {
        this.triangleType = response;
        // this.triangleType = response.type; // Uncomment if the response is an object with a 'type' property
        console.log('Triangle type:', this.triangleType);
        this.drawTriangle();
      },
      error: (err) => {
        console.error('Error fetching triangle type:', err);
        this.triangleType = 'Error determining triangle type';
      }
    });
  }

  drawTriangle() {
    const canvas = this.triangleCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Determine the maximum side length
    const maxSide = Math.max(this.side1, this.side2, this.side3);
  
    // Calculate the scaling factor to fit the triangle within the canvas
    const padding = 20; // Add some padding around the triangle
    const scale = (canvas.width - 2 * padding) / maxSide;
  
    // Scale the sides
    const a = this.side1 * scale;
    const b = this.side2 * scale;
    const c = this.side3 * scale;
  
    // Calculate triangle coordinates using Heron's formula
    const x2 = a;
    const y2 = 0;
    const x3 = (a * a + c * c - b * b) / (2 * a);
    const y3 = Math.sqrt(c * c - x3 * x3);
  
    // Center the triangle in the canvas
    const offsetX = (canvas.width - (x2 + padding)) / 2;
    const offsetY = (canvas.height - (y3 + padding)) / 2;
  
    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX + x2, offsetY + y2);
    ctx.lineTo(offsetX + x3, offsetY + y3);
    ctx.closePath();
  
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    ctx.fillStyle = 'rgba(39, 101, 167, 0.5)';
    ctx.fill();
  }
  /**
   * 
   * 
   * QUAD LOGIC
   * 
   * 
   */

  // UX variable for the last action performed
  // This is used to determine which action was performed last (POST, GET, PUT, DELETE)
  lastAction: 'POST' | 'GET' | 'PUT' | 'DELETE' | null = null;

  setAction(action: 'POST' | 'GET' | 'PUT' | 'DELETE') {
    this.lastAction = action;
  }

  // private quad url
  private quadUrl = 'https://triangle-middleware-app-production.up.railway.app/quad/type';

  // Quadrilateral methods
  postQuad() {
    this.setAction('POST');
    const params = { sideA: this.sideA!, sideB: this.sideB!, sideC: this.sideC!, sideD: this.sideD! };
    this.responseStatus = null;
    this.quadrilateralResponse = null;

    // Check if any side is null before making the request
    if ([this.sideA, this.sideB, this.sideC, this.sideD].some(v => v === null)) {
      this.responseStatus = 400;
      this.quadrilateralResponse = { error: 'Please fill in all 4 sides before submitting.' };
      return;
    }

    this.http.post<QuadResponse>(this.buildUrl(params), {}, { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = res.body;
      },
      error: (err) => {
        this.responseStatus = err.status || null;
        const msg = err.error?.error || err.message || 'Invalid request';
        this.quadrilateralResponse = { error: msg };
      }
    });
  }

  getQuad() {
    this.setAction('GET');
    const params = { sideA: this.sideA!, sideB: this.sideB!, sideC: this.sideC!, sideD: this.sideD! };
    this.responseStatus = null;
    this.quadrilateralResponse = null;

    this.http.get<QuadResponse>(this.buildUrl(params), { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = res.body;
      },
      error: (err) => {
        this.responseStatus = err.status || null;
        const msg = err.error?.error || err.message || 'Invalid request';
        this.quadrilateralResponse = { error: msg };
      }
    });
  }

  putQuad() {
    this.setAction('PUT');
    const params = { sideA: this.sideA!, sideB: this.sideB!, sideC: this.sideC!, sideD: this.sideD! };
    this.responseStatus = null;
    this.quadrilateralResponse = null;

    // Check if any side is null before making the request
    if ([this.sideA, this.sideB, this.sideC, this.sideD].some(v => v === null)) {
      this.responseStatus = 400;
      this.quadrilateralResponse = { error: 'Please fill in all 4 sides before submitting.' };
      return;
    }

    this.http.put<QuadResponse>(this.buildUrl(params), {}, { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = res.body;
      },
      error: (err) => {
        this.responseStatus = err.status || null;
        const msg = err.error?.error || err.message || 'Invalid request';
        this.quadrilateralResponse = { error: msg };
      }
    });
  }

  deleteQuad() {
    this.setAction('DELETE');
    const params = { sideA: this.sideA!, sideB: this.sideB!, sideC: this.sideC!, sideD: this.sideD! };
    this.responseStatus = null;
    this.quadrilateralResponse = null;

    this.http.delete<{ message: string }>(this.buildUrl(params), { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = { type: 'Quadrilateral data has been reset.' } as QuadResponse;
      },
      error: (err) => {
        this.responseStatus = err.status || null;
        const msg = err.error?.error || err.message || 'Invalid request';
        this.quadrilateralResponse = { error: msg };
      }
    });
  }

  private buildUrl(params: Record<string, number | null | undefined>): string {
    const query = Object.entries(params)
      .filter(([_, v]) => typeof v === 'number' && !isNaN(v))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `${this.quadUrl}?${query}`;
  }
}
