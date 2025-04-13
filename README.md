# Running and Testing the TriangleFrontend Project Locally

This guide provides step-by-step instructions to set up, run, and test the TriangleFrontend project on your local machine.

## Prerequisites

Before proceeding, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (install globally using `npm install -g @angular/cli`)

## Steps to Run the Project Locally

1. **Navigate to the Project Directory**

   Open a terminal and navigate to the `triangle-frontend` directory:

   ```bash
   cd triangle-frontend
   ```

   This step ensures you are in the correct directory where the project files are located.

2. **Install Dependencies**

   Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

   This step is crucial because it downloads and installs all the libraries and packages specified in the package.json file. These dependencies are required for the project to build and run correctly.

3. **Start the Development Server**

   Start the Angular development server by running:

   ```bash
   ng serve
   ```

   This command compiles the project and starts a local development server. Once the server is running, open your browser and navigate to http://localhost:4200/ to view the application. The server will automatically reload when you make changes to the source files.

## Steps to Test the Project Locally

1. **Navigate to the Project Directory**

   Ensure you are in the triangle-frontend directory:

2. **Run Unit Tests**

   Execute the following command to run the unit tests:

   ```bash
   ng test
   ```

   This command uses the Karma test runner to execute the unit tests defined in the project. The results will be displayed in the terminal, and a browser window may open to show detailed test results.
