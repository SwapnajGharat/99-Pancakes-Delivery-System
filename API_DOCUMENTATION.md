# 99 Pancakes Panvel - REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Health Check Endpoint

### `GET /api/health`
- **Description:** Verifies backend server health & status.
- **Authentication:** Public
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "99 Pancakes API is running"
}
```

---

## 2. Authentication APIs (`/api/auth`)

### `POST /api/auth/register`
- **Description:** Registers a new customer account.
- **Authentication:** Public
- **Request Body:**
```json
{
  "name": "Rohan Sharma",
  "email": "rohan@example.com",
  "phone": "9876543210",
  "password": "Password@123"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Rohan Sharma",
    "email": "rohan@example.com",
    "phone": "9876543210",
    "role": "customer",
    "avatar": "https://..."
  }
}
```

### `POST /api/auth/login`
- **Description:** Authenticates user and returns JWT token.
- **Authentication:** Public
- **Request Body:**
```json
{
  "email": "customer@99pancakes.com",
  "password": "Customer@123456"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Rohan Sharma",
      "email": "customer@99pancakes.com",
      "phone": "9123456789",
      "role": "customer",
      "avatar": "https://..."
    }
  }
}
```

### `GET /api/auth/me`
- **Description:** Returns profile data of current authenticated user.
- **Authentication:** Private (Bearer Token required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Rohan Sharma",
      "email": "customer@99pancakes.com",
      "phone": "9123456789",
      "role": "customer",
      "avatar": "https://..."
    }
  }
}
```

---

## 3. User Profile APIs (`/api/users`)

### `GET /api/users/profile`
- **Description:** Fetches current user profile.
- **Authentication:** Private (`Bearer Token`)

### `PUT /api/users/profile`
- **Description:** Updates name, phone, or avatar. Changing role is rejected.
- **Authentication:** Private (`Bearer Token`)
- **Request Body:**
```json
{
  "name": "Rohan Sharma Updated",
  "phone": "9988776655",
  "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
}
```

---

## 4. Product APIs (`/api/products`)

### `GET /api/products`
- **Description:** Fetches paginated products with filtering, searching, and sorting.
- **Authentication:** Public
- **Query Parameters:**
  - `search` (e.g., `Nutella`)
  - `category` (slug or category ID, e.g., `mini-pancakes`)
  - `minPrice` (e.g., `100`)
  - `maxPrice` (e.g., `300`)
  - `isVeg` (`true` / `false`)
  - `featured` (`true` / `false`)
  - `sort` (`price-low`, `price-high`, `rating`, `newest`, `name`)
  - `page` (default: `1`)
  - `limit` (default: `12`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 17,
    "pages": 2
  }
}
```

### `GET /api/products/:id`
- **Description:** Retrieves single product by MongoDB ID or slug.
- **Authentication:** Public

### `POST /api/products`
- **Description:** Creates a new product.
- **Authentication:** Admin Only (`Bearer Token`)

### `PUT /api/products/:id`
- **Description:** Updates product details.
- **Authentication:** Admin Only (`Bearer Token`)

### `DELETE /api/products/:id`
- **Description:** Deletes a product.
- **Authentication:** Admin Only (`Bearer Token`)

---

## 5. Category APIs (`/api/categories`)

### `GET /api/categories`
- **Description:** Returns all active categories with product counts.
- **Authentication:** Public

### `GET /api/categories/:id`
- **Description:** Returns single category by ID or slug.
- **Authentication:** Public

### `POST /api/categories`
- **Description:** Creates a category.
- **Authentication:** Admin Only (`Bearer Token`)

### `PUT /api/categories/:id`
- **Description:** Updates a category.
- **Authentication:** Admin Only (`Bearer Token`)

### `DELETE /api/categories/:id`
- **Description:** Deletes a category.
- **Authentication:** Admin Only (`Bearer Token`)

---

## 6. Address APIs (`/api/addresses`)

### `GET /api/addresses`
- **Description:** Gets logged in user's delivery addresses.
- **Authentication:** Private (`Bearer Token`)

### `POST /api/addresses`
- **Description:** Adds a new shipping address.
- **Authentication:** Private (`Bearer Token`)
- **Request Body:**
```json
{
  "fullName": "Rohan Sharma",
  "phone": "9876543210",
  "addressLine": "Flat 402, Sunshine Heights, Sector 15",
  "landmark": "Near Orion Mall",
  "city": "Panvel",
  "state": "Maharashtra",
  "pincode": "410206",
  "type": "Home",
  "isDefault": true
}
```

### `PUT /api/addresses/:id`
- **Description:** Updates owned address.
- **Authentication:** Private (`Bearer Token`)

### `DELETE /api/addresses/:id`
- **Description:** Deletes owned address.
- **Authentication:** Private (`Bearer Token`)

---

## 7. Review APIs (`/api/products/:productId/reviews` & `/api/reviews`)

### `GET /api/products/:productId/reviews`
- **Description:** Gets all reviews for a product.
- **Authentication:** Public

### `POST /api/products/:productId/reviews`
- **Description:** Submits a product review. Auto-updates product average rating and reviewCount.
- **Authentication:** Private (`Bearer Token`)
- **Request Body:**
```json
{
  "rating": 5,
  "comment": "Best pancakes in Panvel! Super fresh and fluffy."
}
```

### `PUT /api/reviews/:id`
- **Description:** Updates owned review.
- **Authentication:** Private (`Bearer Token`)

### `DELETE /api/reviews/:id`
- **Description:** Deletes review (Owner or Admin).
- **Authentication:** Private (`Bearer Token`)
