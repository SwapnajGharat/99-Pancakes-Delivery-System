import http from 'http';
import { env } from '../config/env.js';

const BASE_URL = `http://localhost:${env.PORT || 5000}`;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('==================================================');
  console.log('🚀 RUNNING WEEK 3 API VERIFICATION SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(` ✅ PASS : ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL : ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health Endpoint
    const health = await makeRequest('GET', '/api/health');
    assert(
      health.status === 200 && health.body.success === true,
      'GET /api/health returns 200 success message',
      JSON.stringify(health.body)
    );

    // 2. Admin Login
    const adminLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@99pancakes.com',
      password: 'Admin@123456',
    });
    assert(
      adminLogin.status === 200 && adminLogin.body.data?.token,
      'POST /api/auth/login (Admin login & JWT generation)',
      JSON.stringify(adminLogin.body)
    );
    const adminToken = adminLogin.body.data?.token;

    // 3. Customer Login
    const customerLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'customer@99pancakes.com',
      password: 'Customer@123456',
    });
    assert(
      customerLogin.status === 200 && customerLogin.body.data?.token,
      'POST /api/auth/login (Customer login & JWT generation)',
      JSON.stringify(customerLogin.body)
    );
    const customerToken = customerLogin.body.data?.token;

    // 4. Get Products
    const productsRes = await makeRequest('GET', '/api/products?page=1&limit=5');
    assert(
      productsRes.status === 200 && productsRes.body.pagination?.total > 0,
      'GET /api/products (Paginated list of products returned)',
      `Total products: ${productsRes.body.pagination?.total}`
    );
    const sampleProduct = productsRes.body.data?.[0];

    // 5. Create Order (Customer)
    const createOrderRes = await makeRequest(
      'POST',
      '/api/orders',
      {
        items: [
          {
            product: sampleProduct._id,
            quantity: 2,
          },
        ],
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '9820012345',
          addressLine: 'Flat 101, Sector 15, New Panvel East',
          city: 'Panvel',
          state: 'Maharashtra',
          pincode: '410206',
        },
        paymentMethod: 'COD',
      },
      customerToken
    );
    assert(
      createOrderRes.status === 201 && createOrderRes.body.data?._id,
      'POST /api/orders (Customer creates order with server price validation)',
      JSON.stringify(createOrderRes.body)
    );
    const createdOrder = createOrderRes.body.data;

    // 6. Get My Orders (Customer)
    const myOrdersRes = await makeRequest('GET', '/api/orders', null, customerToken);
    assert(
      myOrdersRes.status === 200 && Array.isArray(myOrdersRes.body.data) && myOrdersRes.body.data.length > 0,
      'GET /api/orders (Customer retrieves personal order history)',
      `Total orders: ${myOrdersRes.body.data?.length}`
    );

    // 7. Get Order Details (Customer)
    const orderDetailsRes = await makeRequest('GET', `/api/orders/${createdOrder._id}`, null, customerToken);
    assert(
      orderDetailsRes.status === 200 && orderDetailsRes.body.data?._id === createdOrder._id,
      'GET /api/orders/:id (Returns order details for owner)',
      JSON.stringify(orderDetailsRes.body)
    );

    // 8. Admin Update Order Status
    const updateStatusRes = await makeRequest(
      'PUT',
      `/api/orders/${createdOrder._id}/status`,
      { orderStatus: 'CONFIRMED' },
      adminToken
    );
    assert(
      updateStatusRes.status === 200 && updateStatusRes.body.data?.orderStatus === 'CONFIRMED',
      'PUT /api/orders/:id/status (Admin updates order status to CONFIRMED)',
      JSON.stringify(updateStatusRes.body)
    );

    // 9. Cancel Order (Customer)
    const cancelOrderRes = await makeRequest('PUT', `/api/orders/${createdOrder._id}/cancel`, null, customerToken);
    assert(
      cancelOrderRes.status === 200 && cancelOrderRes.body.data?.orderStatus === 'CANCELLED',
      'PUT /api/orders/:id/cancel (Customer cancels order when PENDING/CONFIRMED)',
      JSON.stringify(cancelOrderRes.body)
    );

    console.log('\n==================================================');
    console.log(`📊 API VERIFICATION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log('==================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('\n❌ Test suite failed with unhandled exception:', err);
    process.exit(1);
  }
};

runTests();
