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

// Define the environment variable for local and production
// This is a simple enum to switch between local and production environments
enum Env {
  Local = 'local',
  Prod = 'prod'
}
// Set the environment variable here
// You can change this to Env.Prod when deploying to production
const ENV: Env = Env.Prod;

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

  // Declare it here
  private BASE_BACKEND_URL: string;

  // URLs depending on env
  private quadUrl: string;

  // Triangle properties
  title = 'triangle-frontend';
  side1: number = 0;
  side2: number = 0;
  side3: number = 0;
  triangleType: string = '';

  @ViewChild('triangleCanvas', { static: false }) triangleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quadCanvas', { static: false }) quadCanvas!: ElementRef<HTMLCanvasElement>;


  // Quadrilateral properties
  title2 = 'quadrilateral-frontend';
  sideA: number | null = null;
  sideB: number | null = null;
  sideC: number | null = null;
  sideD: number | null = null;
  responseStatus: number | null = null;
  quadrilateralResponse: QuadResponse | { error: string } | null = null;

  // Determine the base backend URL based on environment setting.
  // If ENV is 'Prod', use the deployed production server. (Declared Above)
  // If ENV is 'Local', use the local development backend. (Declared Above)
  // This makes it easy to switch between local testing and production without changing URLs everywhere.
  constructor(private http: HttpClient) {      
    this.BASE_BACKEND_URL = ENV === Env.Prod
      ? 'https://triangle-middleware-app-production.up.railway.app'
      : 'http://localhost:8080';

    this.quadUrl = `${this.BASE_BACKEND_URL}/quad/type`;
  }

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
  // private quadUrl = 'https://triangle-middleware-app-production.up.railway.app/quad/type';
  // private quadUrl = 'http://localhost:8080/quad/type';
  // private quadUrl = `${BASE_BACKEND_URL}/quad/type`;

  // Quadrilateral methods
  postQuad() {
    this.setAction('POST');
    const params = { sideA: this.sideA!, sideB: this.sideB!, sideC: this.sideC!, sideD: this.sideD! };
    this.responseStatus = null;
    this.quadrilateralResponse = null;

    // Check if any side is null before making the request
    if ([this.sideA, this.sideB, this.sideC, this.sideD].some(v => v === null || isNaN(v))) {
      this.responseStatus = 400;
      this.quadrilateralResponse = { error: 'Please enter valid numbers for all sides.' };
      return;
    }

    this.http.post<QuadResponse | { error: string }>(this.buildUrl(params), {}, { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = res.body;

        if ('type' in res.body!) {
          this.drawQuadrilateral(res.body!.type);
          console.log('Drawing quadrilateral:', res.body!.type);
        }
        // (If error instead of type, don't crash!)
        // this.drawQuadrilateral(res.body!.type);
        // console.log('Drawing quadrilateral:', res.body!.type);
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
    if ([this.sideA, this.sideB, this.sideC, this.sideD].some(v => v === null || isNaN(v))) {
      this.responseStatus = 400;
      this.quadrilateralResponse = { error: 'Please enter valid numbers for all sides.' };
      return;
    }

    this.http.put<QuadResponse | { error: string }>(this.buildUrl(params), {}, { observe: 'response' }).subscribe({
      next: (res) => {
        this.responseStatus = res.status;
        this.quadrilateralResponse = res.body;

        if ('type' in res.body!) {
          this.drawQuadrilateral(res.body!.type);
        }
        // this.drawQuadrilateral(res.body!.type);
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
        this.clearQuadCanvas();
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

  drawQuadrilateral(type: string) {
    console.log('[Canvas] Drawing type:', type);
    const canvas = this.quadCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[Canvas] Context not found!');
      return;
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const padding = 40;
    const w = canvas.width - padding * 2;
    const h = canvas.height - padding * 2;
  
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
  
    // SQUARE / RHOMBUS
    if (type.includes('Square') || type.includes('Rhombus')) {
      const size = Math.min(w, h);
      ctx.rect(padding, padding, size, size);
      ctx.closePath();
      this.fillAndLabel(ctx, padding, padding, padding + size, padding, padding + size, padding + size, padding, padding + size, 
        [this.sideA!, this.sideB!, this.sideC!, this.sideD!]);
        
    // RECTANGLE
    } else if (type.includes('Rectangle')) {
      const rectWidth = w;
      const rectHeight = h / 2;
      ctx.rect(padding, padding, rectWidth, rectHeight);
      ctx.closePath();
      this.fillAndLabel(ctx, padding, padding, padding + rectWidth, padding, padding + rectWidth, padding + rectHeight, padding, padding + rectHeight, 
        [this.sideA!, this.sideB!, this.sideC!, this.sideD!]);
        
    // PARALLELOGRAM (NEW)
    } else if (type.includes('Parallelogram')) {
      const slant = 40; // Slant the top line
      ctx.moveTo(padding + slant, padding);
      ctx.lineTo(padding + w, padding);
      ctx.lineTo(padding + w - slant, padding + h);
      ctx.lineTo(padding, padding + h);
      ctx.closePath();
      this.fillAndLabel(ctx, padding + slant, padding, padding + w, padding, padding + w - slant, padding + h, padding, padding + h, 
        [this.sideA!, this.sideB!, this.sideC!, this.sideD!]);
        
    // KITE (NEW)
    } else if (type.includes('Kite')) {
      const midX = canvas.width / 2;
      const topY = padding;
      const leftX = padding;
      const rightX = canvas.width - padding;
      const bottomY = canvas.height - padding;
      const centerY = canvas.height / 2;
      ctx.moveTo(midX, topY);
      ctx.lineTo(rightX, centerY);
      ctx.lineTo(midX, bottomY);
      ctx.lineTo(leftX, centerY);
      ctx.closePath();
      this.fillAndLabel(ctx, midX, topY, rightX, centerY, midX, bottomY, leftX, centerY, 
        [this.sideA!, this.sideB!, this.sideC!, this.sideD!]);
        
    // GENERIC QUADRILATERAL (Fallback)
    } else {
      const ax = padding;
      const ay = padding + 30;
      const bx = canvas.width - padding;
      const by = padding;
      const cx = canvas.width - padding - 30;
      const cy = canvas.height - padding;
      const dx = padding + 30;
      const dy = canvas.height - padding;
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cx, cy);
      ctx.lineTo(dx, dy);
      ctx.closePath();
      this.fillAndLabel(ctx, ax, ay, bx, by, cx, cy, dx, dy, 
        [this.sideA!, this.sideB!, this.sideC!, this.sideD!]);
          }
  }

  private fillAndLabel(
    ctx: CanvasRenderingContext2D,
    ax: number, ay: number,
    bx: number, by: number,
    cx: number, cy: number,
    dx: number, dy: number,
    sides?: [number, number, number, number]
  ) {
    ctx.fillStyle = 'rgba(167, 101, 39, 0.4)';
    ctx.fill();
    ctx.stroke();
  
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
  
    // Label text values
    const labelA = sides ? `A (${sides[0]})` : 'A';
    const labelB = sides ? `B (${sides[1]})` : 'B';
    const labelC = sides ? `C (${sides[2]})` : 'C';
    const labelD = sides ? `D (${sides[3]})` : 'D';
  
    const offsetFar = 20; 
    const offsetUp = 16;  
  
    // Updated spacing to move labels away from the shape
  
    ctx.fillText(labelA, (ax + bx) / 2, (ay + by) / 2 - offsetUp);  // Top center (move up more)
    ctx.fillText(labelB, (bx + cx) / 2 + offsetFar, (by + cy) / 2); // Right center (move right more)
    ctx.fillText(labelC, (cx + dx) / 2, (cy + dy) / 2 + offsetUp);  // Bottom center (move down more)
    ctx.fillText(labelD, (dx + ax) / 2 - offsetFar, (dy + ay) / 2); // Left center (move left more)
  }
  
  
  
  clearQuadCanvas() {
    // Reset input fields
    this.sideA = null;
    this.sideB = null;
    this.sideC = null;
    this.sideD = null;

    // Clear the canvas
    const canvas = this.quadCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
}
