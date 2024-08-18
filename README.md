# NestJS E-commerce API with k6 Load Testing

This project is an e-commerce API built with NestJS, featuring product management functionality and comprehensive load testing using k6.

## Project Description

This API provides endpoints for managing products in an e-commerce system. It includes functionality for:

- Retrieving all products
- Retrieving a single product by ID
- Creating new products
- Updating product stock

The project also includes a suite of k6 load tests to ensure the API can handle various levels of traffic and stress.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm
- NestJS CLI
- MongoDB (running locally or accessible via URL)

## Setting Up the Project

To set up the repository, follow these steps:

* Install all dependencies:

  ```bash
  npm install
  ```

* Setup/Create **.env** file in the root directory of the project with all the mentioned variables in the [`example.env`](example.env) file.

* Start the application:

  ```bash
  npm run start:dev
  ```

  The API should now be running at `http://localhost:3000`

## Setting Up k6

1. Install k6 on your system:
  - k6 has packages for Linux, Mac, and Windows. Alternatively, you can use a Docker container or a standalone binary.
  - For detailed installation instructions for your specific system, refer to the [official k6 installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)

2. Install the k6 module for NestJS:
  ```bash
  npm install k6

  npm install -D @types/k6
  ```

3. Ensure you have a `productIds.json` file in the `test` directory. This file should contain an array of valid product IDs from your database. The structure should be:
  ```json
  {
    "ids": [
      "60d21b4667d0d8992e610c85",
      "60d21b4667d0d8992e610c86",
      "60d21b4667d0d8992e610c87"
    ]
  }
  ```

  Note: You may need to update this file periodically as your product data changes.

## Running Load Tests

Before running the tests, ensure your NestJS application is running in a separate terminal.

Navigate to the `test` directory and run the following commands for different load test scenarios:

1. Load Test:
  ```bash
  k6 run load-test.spec.ts
  ```

2. Stress Test:
  ```bash
  k6 run stress-test.spec.ts
  ```

3. Spike Test:
  ```bash
  k6 run spike-test.spec.ts
  ```

4. Soak Test:
  ```bash
  k6 run soak-test.spec.ts
  ```

Each test will output its results in the terminal. Review these results to understand how your API performs under different conditions.

## Notes

- Ensure that your MongoDB instance is running and accessible before starting the NestJS application or running tests.
- The `productIds.json` file is crucial for the proper functioning of the single product GET requests in the load tests. Make sure to keep this file updated with valid product IDs from your database.
- You may need to adjust the test parameters (VUs, duration, thresholds) in the k6 scripts based on your specific performance requirements and system capabilities.

## API Documentation

To view the Swagger API documentation:

1. Start the application using one of the methods described in the "Running the app" section.
2. Open your web browser and navigate to `http://localhost:3000/api`.
3. You will see the Swagger UI interface with all the available API endpoints and their descriptions.

This documentation provides a comprehensive overview of all API endpoints, request/response schemas, and allows you to test the API directly from the browser.
