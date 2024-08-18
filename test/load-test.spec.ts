import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const failureRate = new Rate('failed_requests');

// Load product IDs from a JSON file
const productIds = new SharedArray('product ids', function () {
  return JSON.parse(open('./productIds.json')).ids;
});

export const options = {
  vus: 50, // Number of virtual users
  // duration: '5m', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    failed_requests: ['rate<0.1'], // Less than 10% of requests should fail
  },

  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users over 1 minute
    { duration: '3m', target: 50 }, // Stay at 50 users for 3 minutes
    { duration: '1m', target: 0 }, // Ramp down to 0 users over 1 minute
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all products (60% of requests)
  if (Math.random() < 0.6) {
    const response = http.get(`${BASE_URL}/products`);
    check(response, {
      'get all products status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(2);
  }

  // GET single product (30% of requests)
  else if (Math.random() < 0.9) {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const response = http.get(`${BASE_URL}/products/${productId}`);
    check(response, {
      'get single product status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(2);
  }

  // POST new product (10% of requests)
  else {
    const payload = JSON.stringify({
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      stockQuantity: 100,
      category: 'Test',
      onSale: false,
    });
    const response = http.post(`${BASE_URL}/products`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(response, {
      'create product status was 201': (r) => r.status == 201,
    });
    failureRate.add(response.status !== 201);
    sleep(3);
  }
}
