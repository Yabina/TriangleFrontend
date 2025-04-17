import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { response } from 'express';

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
  imports: [FormsModule, CommonModule],
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
      },
      error: (err) => {
        console.error('Error fetching triangle type:', err);
        this.triangleType = 'Error determining triangle type';
      }
    });
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
