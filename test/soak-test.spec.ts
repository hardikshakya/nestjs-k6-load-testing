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
  vus: 100, // Number of virtual users
  // duration: '4h', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    failed_requests: ['rate<0.05'], // Less than 5% of requests should fail over long period
  },

  stages: [
    { duration: '5m', target: 100 }, // Ramp up to 100 users over 5 minutes
    { duration: '3h50m', target: 100 }, // Stay at 100 users for 3 hours and 50 minutes
    { duration: '5m', target: 0 }, // Ramp down to 0 users over 5 minutes
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all products (50% of requests)
  if (Math.random() < 0.5) {
    const response = http.get(`${BASE_URL}/products`);
    check(response, {
      'get all products status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // GET single product (40% of requests)
  else if (Math.random() < 0.9) {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const response = http.get(`${BASE_URL}/products/${productId}`);
    check(response, {
      'get single product status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // PATCH update stock (10% of requests to simulate occasional purchases)
  else {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const payload = JSON.stringify({ quantity: 1 }); // Simulate purchasing 1 item
    const response = http.patch(
      `${BASE_URL}/products/${productId}/stock`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    check(response, { 'update stock status was 200': (r) => r.status == 200 });
    failureRate.add(response.status !== 200);
    sleep(2);
  }
}
