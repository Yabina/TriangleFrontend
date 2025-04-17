import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Import the standalone component directly
        HttpClientTestingModule, // Use HttpClientTestingModule for mocking HTTP requests
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'triangle-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('triangle-frontend');
  });

  it('should fetch triangle type on getTriangleType()', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Call the method
    app.side1 = 3;
    app.side2 = 4;
    app.side3 = 5;
    app.getTriangleType();

    // Mock the HTTP request
    const req = httpTestingController.expectOne(
      `https://triangle-middleware-app-production.up.railway.app/triangle/type?side1=3&side2=4&side3=5`
    );
    expect(req.request.method).toEqual('GET');

    // Respond with mock data
    req.flush({ type: 'Scalene' });

    // Assert the result
    expect(app.triangleType).toEqual('Scalene');
  });

  it('should handle error when fetching triangle type', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Call the method
    app.side1 = 3;
    app.side2 = 4;
    app.side3 = 5;
    app.getTriangleType();

    // Mock the HTTP request
    const req = httpTestingController.expectOne(
      `https://triangle-middleware-app-production.up.railway.app/triangle/type?side1=3&side2=4&side3=5`
    );
    expect(req.request.method).toEqual('GET');

    // Respond with an error
    req.error(new ErrorEvent('Network error'));

    // Assert the result
    expect(app.triangleType).toEqual('Error determining triangle type');
  });
});