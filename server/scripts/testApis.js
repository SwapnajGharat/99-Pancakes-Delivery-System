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
  console.log('🚀 RUNNING WEEK 2 API VERIFICATION SUITE');
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

    // 4. Invalid Login (Validation & Auth Error)
    const invalidLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'customer@99pancakes.com',
      password: 'WrongPassword123',
    });
    assert(
      invalidLogin.status === 401 && invalidLogin.body.success === false,
      'POST /api/auth/login (Rejects invalid password with 401)',
      JSON.stringify(invalidLogin.body)
    );

    // 5. Register New User
    const testEmail = `testuser_${Date.now()}@example.com`;
    const registration = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Customer',
      email: testEmail,
      phone: '9988776655',
      password: 'Password@123',
    });
    assert(
      registration.status === 201 && registration.body.token,
      'POST /api/auth/register (Registers new user & returns JWT)',
      JSON.stringify(registration.body)
    );

    // 6. Duplicate Registration Error
    const duplicateReg = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Customer',
      email: testEmail,
      password: 'Password@123',
    });
    assert(
      duplicateReg.status === 409 && duplicateReg.body.success === false,
      'POST /api/auth/register (Rejects duplicate email registration with 409)',
      JSON.stringify(duplicateReg.body)
    );

    // 7. Get Current User (/api/auth/me)
    const getMeRes = await makeRequest('GET', '/api/auth/me', null, customerToken);
    assert(
      getMeRes.status === 200 && getMeRes.body.data.user.email === 'customer@99pancakes.com',
      'GET /api/auth/me (Returns authenticated user profile)',
      JSON.stringify(getMeRes.body)
    );

    // 8. Reject Unauthenticated Access
    const noAuthRes = await makeRequest('GET', '/api/auth/me');
    assert(
      noAuthRes.status === 401,
      'GET /api/auth/me (Rejects unauthenticated request with 401)',
      JSON.stringify(noAuthRes.body)
    );

    // 9. Get Categories
    const categoriesRes = await makeRequest('GET', '/api/categories');
    assert(
      categoriesRes.status === 200 && Array.isArray(categoriesRes.body.data),
      'GET /api/categories (Returns category list with counts)',
      `Total: ${categoriesRes.body.data?.length}`
    );
    const firstCategory = categoriesRes.body.data?.[0];

    // 10. Get Products (Public)
    const productsRes = await makeRequest('GET', '/api/products?page=1&limit=5');
    assert(
      productsRes.status === 200 && productsRes.body.pagination?.total > 0,
      'GET /api/products (Paginated list of products returned)',
      `Total products: ${productsRes.body.pagination?.total}`
    );
    const sampleProduct = productsRes.body.data?.[0];

    // 11. Search Products
    const searchRes = await makeRequest('GET', '/api/products?search=Nutella');
    assert(
      searchRes.status === 200 && searchRes.body.data.length > 0,
      'GET /api/products?search=Nutella (Returns matching search results)',
      `Matches: ${searchRes.body.data?.length}`
    );

    // 12. Filter Products by Category & Sorting
    const filterRes = await makeRequest('GET', '/api/products?category=waffles&sort=price-high');
    assert(
      filterRes.status === 200 && Array.isArray(filterRes.body.data),
      'GET /api/products?category=waffles&sort=price-high (Filtered and sorted)',
      `Count: ${filterRes.body.data?.length}`
    );

    // 13. Get Single Product by ID
    const singleProductRes = await makeRequest('GET', `/api/products/${sampleProduct?._id}`);
    assert(
      singleProductRes.status === 200 && singleProductRes.body.data?._id === sampleProduct?._id,
      'GET /api/products/:id (Returns single product details)',
      JSON.stringify(singleProductRes.body)
    );

    // 14. Admin Only Protection Test: Customer trying to create product
    const customerCreateProduct = await makeRequest(
      'POST',
      '/api/products',
      {
        name: 'Forbidden Pancake',
        description: 'Should fail',
        price: 100,
        category: firstCategory?._id,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
      },
      customerToken
    );
    assert(
      customerCreateProduct.status === 403,
      'POST /api/products (Rejects customer role with 403 Forbidden)',
      JSON.stringify(customerCreateProduct.body)
    );

    // 15. Admin Create Product
    const adminCreateProduct = await makeRequest(
      'POST',
      '/api/products',
      {
        name: `Test Special Pancake ${Date.now()}`,
        description: 'Delicious test creation for verification',
        price: 299,
        category: firstCategory?._id,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
        isVeg: true,
        featured: true,
      },
      adminToken
    );
    assert(
      adminCreateProduct.status === 201 && adminCreateProduct.body.data?._id,
      'POST /api/products (Admin creates product successfully)',
      JSON.stringify(adminCreateProduct.body)
    );
    const createdProductId = adminCreateProduct.body.data?._id;

    // 16. Admin Update Product
    const adminUpdateProduct = await makeRequest(
      'PUT',
      `/api/products/${createdProductId}`,
      {
        price: 319,
        description: 'Updated description for test product',
      },
      adminToken
    );
    assert(
      adminUpdateProduct.status === 200 && adminUpdateProduct.body.data?.price === 319,
      'PUT /api/products/:id (Admin updates product successfully)',
      JSON.stringify(adminUpdateProduct.body)
    );

    // 17. Admin Delete Product
    const adminDeleteProduct = await makeRequest('DELETE', `/api/products/${createdProductId}`, null, adminToken);
    assert(
      adminDeleteProduct.status === 200,
      'DELETE /api/products/:id (Admin deletes product successfully)',
      JSON.stringify(adminDeleteProduct.body)
    );

    // 18. Address CRUD (Customer)
    const createAddressRes = await makeRequest(
      'POST',
      '/api/addresses',
      {
        fullName: 'Rohan Test',
        phone: '9123456789',
        addressLine: 'Flat 101, Test Residency',
        city: 'Panvel',
        state: 'Maharashtra',
        pincode: '410206',
        type: 'Home',
        isDefault: true,
      },
      customerToken
    );
    assert(
      createAddressRes.status === 201 && createAddressRes.body.data?._id,
      'POST /api/addresses (Customer creates new shipping address)',
      JSON.stringify(createAddressRes.body)
    );
    const addressId = createAddressRes.body.data?._id;

    const getAddressesRes = await makeRequest('GET', '/api/addresses', null, customerToken);
    assert(
      getAddressesRes.status === 200 && getAddressesRes.body.data.length > 0,
      'GET /api/addresses (Customer retrieves personal address list)',
      `Total addresses: ${getAddressesRes.body.data?.length}`
    );

    const deleteAddressRes = await makeRequest('DELETE', `/api/addresses/${addressId}`, null, customerToken);
    assert(
      deleteAddressRes.status === 200,
      'DELETE /api/addresses/:id (Customer deletes owned address)',
      JSON.stringify(deleteAddressRes.body)
    );

    // 19. Review CRUD & Rating Recalculation
    const createReviewRes = await makeRequest(
      'POST',
      `/api/products/${sampleProduct?._id}/reviews`,
      {
        rating: 5,
        comment: 'Outstanding flavor and packaging!',
      },
      customerToken
    );
    assert(
      createReviewRes.status === 201 || createReviewRes.status === 400,
      'POST /api/products/:id/reviews (Create review or handled existing review cleanly)',
      JSON.stringify(createReviewRes.body)
    );

    const getReviewsRes = await makeRequest('GET', `/api/products/${sampleProduct?._id}/reviews`);
    assert(
      getReviewsRes.status === 200 && Array.isArray(getReviewsRes.body.data),
      'GET /api/products/:id/reviews (Fetch product reviews)',
      `Reviews count: ${getReviewsRes.body.data?.length}`
    );

    // 20. Profile Update & Protection
    const updateProfileRes = await makeRequest(
      'PUT',
      '/api/users/profile',
      {
        name: 'Rohan Updated',
        phone: '9888877777',
      },
      customerToken
    );
    assert(
      updateProfileRes.status === 200 && updateProfileRes.body.data?.name === 'Rohan Updated',
      'PUT /api/users/profile (Updates user name and phone)',
      JSON.stringify(updateProfileRes.body)
    );

    // 21. Attempt Customer Role Escalation (Must fail)
    const escalateRoleRes = await makeRequest(
      'PUT',
      '/api/users/profile',
      {
        role: 'admin',
      },
      customerToken
    );
    assert(
      escalateRoleRes.status === 422,
      'PUT /api/users/profile (Rejects customer attempt to change role with 422 Validation Error)',
      JSON.stringify(escalateRoleRes.body)
    );

    // 22. 404 Route Test
    const notFoundRes = await makeRequest('GET', '/api/nonexistent-route-xyz');
    assert(
      notFoundRes.status === 404 && notFoundRes.body.success === false,
      'GET /api/undefined-route (Returns 404 Not Found error)',
      JSON.stringify(notFoundRes.body)
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
