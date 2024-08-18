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
  vus: 300, // Maximum number of virtual users
  // duration: '25m', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    failed_requests: ['rate<0.1'], // Less than 10% of requests should fail
  },

  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 }, // Ramp up to 200 users over 2 minutes
    { duration: '5m', target: 200 }, // Stay at 200 users for 5 minutes
    { duration: '2m', target: 300 }, // Ramp up to 300 users over 2 minutes
    { duration: '5m', target: 300 }, // Stay at 300 users for 5 minutes
    { duration: '2m', target: 0 }, // Ramp down to 0 users over 2 minutes
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all products (40% of requests)
  if (Math.random() < 0.4) {
    const response = http.get(`${BASE_URL}/products`);
    check(response, {
      'get all products status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // GET single product (20% of requests)
  else if (Math.random() < 0.6) {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const response = http.get(`${BASE_URL}/products/${productId}`);
    check(response, {
      'get single product status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // PATCH update stock (40% of requests to simulate many purchases)
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
    sleep(1);
  }
}
