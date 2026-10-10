# 🛒 PROMPT: SENIOR FULL-CYCLE FRONTEND IMPLEMENTATION FOR BACH HOA XANH ONLINE (FRESHMART)

You are a **Staff Frontend Engineer and UI/UX Architect**. Your task is to build a modern, high-performance, and pixel-perfect Single Page Application (SPA) for the **Bách Hóa Xanh Online (FreshMart)** e-commerce supermarket system.

---

## 📌 CRITICAL DIRECTIVES & GROUND TRUTHS

### 1. Adhere to the Existing Directory Structure
The project scaffold has already been initialized using **Vite + React**. You MUST strictly follow the existing file and folder architecture without creating redundant or conflicting directories:

```text
FE_BachHoaXanhOnline/
├── public/
├── src/
│   ├── assets/              # Icons, banners, product mock graphics
│   ├── components/          # Reusable UI (ProductCard, Modal, Toast, Button, Badge)
│   │   └── ProductCard/     # Isolated ProductCard module (SRP, DRY)
│   ├── constants/           # paths.js, apiEndpoints.js, storageKeys.js, enums.js
│   ├── hooks/               # Custom hooks (useAuth, useCart, useProducts, useDebounce, etc.)
│   ├── modules/             # Domain pages & features (shop, auth, cart, checkout, profile, admin)
│   ├── routes/              # AppRoutes.jsx, ProtectedRoute.jsx, route config
│   ├── services/            # apiClient.js (Axios instance), authService, productService, etc.
│   ├── stores/              # Global stores (Zustand or Context API: AuthStore, CartStore)
│   ├── styles/              # Global CSS / CSS variables / tokens
│   ├── utils/               # formatters.js (VND currency, date), validators, httpErrorHandler
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .oxlintrc.json
├── API_DOCUMENTATION.md     # 🌟 SINGLE SOURCE OF TRUTH FOR ALL API CONTRACTS
├── APIDesign.md             # Detailed API specifications & business rules
├── package.json
└── vite.config.js
```

---

### 2. Strict API Contract Matching
- Refer to `API_DOCUMENTATION.md` and `APIDesign.md` in the root directory as the single source of truth.
- All backend responses use the standard envelope:
  ```typescript
  interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
  }
  ```
- All protected requests must transmit the JWT Bearer token in the header: `Authorization: Bearer <accessToken>`.
- The backend handles authentication via short-lived JWT `accessToken` in memory/localStorage and HttpOnly cookie `refreshToken` (`withCredentials: true` is strictly required on all requests).

---

### 3. Visual Fidelity (Matching the Design Screenshot)

- **Header / Brand:**
  - Leaf emblem + `"FreshMart - ORGANIC & SUPERMARKET"`.
  - Location selector pill (`"DELIVER TO Downtown Central"`).
  - Live search bar with input: `"Search fresh apples, organic milk, ribeye steak, bakery..."` + emerald green Search button.
  - User pill (`"Sign In"` / User avatar).
  - Cart button with badge pill (`"$0.00 [ 0 ]"`).

- **Hero Banner:**
  - Deep organic emerald green background (`#0e4b38` or `#13523d`).
  - Rounded corners (`16px-20px`).
  - Badge `"★ 100% FARM FRESH GUARANTEED"`.
  - Large display typography: `"Eat Fresh, Live Healthy with Same-Day Delivery"`.
  - Descriptive subheader.
  - Subtle basket watermark silhouette.

- **Left Sidebar Filter Card:**
  - **Card header:** `"Filters"` with a clickable `"Reset All"` button.
  - **Departments:** Dynamic category chips/radios (default: `"All Departments"`).
  - **Price Range ($/VND):** Dual input boxes (Min / Max) + dark pill button `"Apply Price"`.
  - **Availability:** Styled checkbox for `"In-Stock Only"`.
  - **Trust & Perk Badges:**
    - ⚡ Express 30-min delivery
    - 💳 Dynamic VietQR instant pay
    - 🛡️ Freshness guarantee

- **Main Catalog Bar:**
  - Counter showing `"Showing X fresh items"`.
  - Dropdown `"SORT BY: Featured Items"` (with options: *Price Low to High*, *Price High to Low*, *Rating*, *Newest*).

- **Product Grid (4 Cards/Row on Desktop):**
  - Discount pill (`-20%`) + Status badge (`BEST SELLER`).
  - Product photo container with clean hover-zoom.
  - Department badge (e.g., `Fruits`) + Rating stars (`★ 5.0 (0)`).
  - Title typography (e.g., `Seedless Red Table Grapes`).
  - Nutritional/specs snippet (e.g., `Calories: 69 kcal/100g, Lycopene...`).
  - Pricing: Primary bold price + strikethrough original price + unit indicator (`per kg`, `per piece`, `per pack`).
  - Circular green `+` Add to Cart button with micro-animation and feedback.

---

## 🚀 PHASED IMPLEMENTATION ROADMAP

> **Directive:** Execute the implementation phase by phase. Complete each milestone thoroughly before progressing to the next.

---

### 🧩 PHASE 1: NETWORKING, STATE & DESIGN SYSTEM FOUNDATION
**Goal:** Establish the base client, design tokens, and authentication interceptors.

#### Tasks:
1. **Configure `src/services/apiClient.js` using Axios:**
   - Set `baseURL` to `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/BachHoaXanhOnline'`.
   - Enable `withCredentials: true` for automatic `refreshToken` cookie handling.
   - Implement **Request Interceptor**: inject `Authorization: Bearer <accessToken>`.
   - Implement **Response Interceptor**: when receiving `401 Unauthorized`, trigger `/auth/refresh` to acquire a new access token and replay the queued requests.
2. **Define Constants:**
   - Route constants in `src/constants/paths.js`.
   - API route endpoints in `src/constants/apiEndpoints.js`.
3. **Set up Global CSS in `src/styles/`:**
   - Color tokens: Emerald brand primary (`#10b981`, `#047857`, `#064e3b`), text neutrals, card border radius, soft drop shadows.
   - Typography (`Inter` / `Roboto` / `Plus Jakarta Sans`).
4. **Create `src/stores/useAuthStore.js`:**
   - **State:** `user`, `accessToken`, `userType` (`'CUSTOMER' | 'STAFF' | 'ADMIN'`), `isAuthenticated`.
   - **Actions:** `login(credentials)`, `logout()`, `refreshSession()`, `setAuth(data)`.

---

### 🧩 PHASE 2: MASTER LAYOUT & SHOP CATALOG (PIXEL-PERFECT MATCH)
**Goal:** Recreate the exact UI layout from the provided screenshot.

#### Tasks:
1. **Navbar & Header:**
   - Logo with leaf SVG and supermarket tagline.
   - Delivery address selector pill (dropdown or address modal trigger).
   - Search bar with debounce hook (`useDebounce.js`).
   - Cart trigger button displaying current item count and formatted total amount.
   - User authentication button (shows user name and dropdown if logged in, or opens Login/Register modal).
2. **Hero Banner Component:**
   - Responsive hero container matching the screenshot with emerald gradient, promotional copy, and basket vector silhouette.
3. **Sidebar Filter Component:**
   - Fetch public categories via `GET /category` to populate the Departments list.
   - Price Range inputs with numeric validation and `Apply Price` submission.
   - In-Stock toggle (`inStock=true|false`).
   - Value proposition perk badges (Express 30-min, Dynamic VietQR, Freshness guarantee).
   - `Reset All` handler clearing all active filters.
4. **Product Grid & ProductCard Component (`src/components/ProductCard/`):**
   - Integrate with `GET /product` accepting query params: `page`, `limit`, `keyword`, `categoryId`, `sortBy`, `inStock`.
   - **Card UI:** Discount badge, Best Seller pill, high-res image, department label, star rating summary, title, spec subtitle, formatted price + unit, and quick `+` Add to Cart button.
   - Pagination controls or infinite scroll matching backend `total`, `page`, and `limit`.

---

### 🧩 PHASE 3: CART, MODALS & AUTHENTICATION FLOW
**Goal:** Implement seamless cart operations, authentication modals, and product detail view.

#### Tasks:
1. **Cart Store & Cart Drawer (`src/stores/useCartStore.js`):**
   - **If authenticated as Customer:** sync directly with backend:
     - `GET /cart` (Fetch items and totals).
     - `POST /cart/items` (`{ productId, quantity }`).
     - `PUT /cart/items/:lineItemId` (`{ quantity }`).
     - `DELETE /cart/items/:lineItemId`.
     - `DELETE /cart/clear`.
   - **If guest:** maintain local state and prompt login before checkout.
   - Cart Drawer/Dropdown showing line items, item counters (`+` / `-`), and instant total calculation.
2. **Auth Modals & Pages (`src/modules/auth/`):**
   - **Login:** `POST /auth/login` (`{ username, password }`). Handles both Customer and Employee profiles.
   - **Register:** `POST /auth/register` (`{ username, fullName, email, phoneNumber, password, birthDate }`).
   - Inline form validation and toast notification for error messages (e.g., `409 Conflict`, `400 Bad Request`).
3. **Product Detail Page (`GET /product/:id`):**
   - Showcase image, category, supplier, stock status, VAT, expiry date, average rating, and product reviews.

---

### 🧩 PHASE 4: CHECKOUT, ORDER & DYNAMIC VIETQR PAYMENT (PAYOS)
**Goal:** Complete the ordering process and dynamic VietQR instant payment flow.

#### Tasks:
1. **Checkout Module (`src/modules/checkout/`):**
   - Address selector loaded from `GET /address` (or inline address creation).
   - Order note field (`ghiChu`).
   - Promotion voucher selector using `GET /promotion/available?totalAmount=...`.
   - Order submission via `POST /order` (`{ tenNguoiNhan, soDienThoaiNhan, diaChiGiaoHang }`).
2. **Payment & Dynamic VietQR Flow (`src/modules/payment/`):**
   - Once an order is created, trigger `POST /payment/create/:orderId`.
   - **Backend response payload:**
     ```typescript
     interface PaymentLinkData {
       orderId: string;
       orderCode: number;
       checkoutUrl: string;
       qrCode: string; // Dynamic VietQR string or image
       bin: string;
       accountNumber: string;
       accountName: string;
       amount: number;
       status: string;
     }
     ```
   - **VietQR Modal / Screen:**
     - Render the dynamic VietQR code.
     - Display bank details: Bank Name/BIN, Account Number (with 1-click Copy button), Account Holder Name, Transfer Amount, and Transfer Content (`orderCode`).
     - Provide a button to open PayOS checkout URL if the user prefers web banking.
     - Implement automatic polling (`GET /order/:orderId`) to detect when order status switches to `DATHANHTOAN` and transition immediately to Order Success screen.
3. **Order History (`src/modules/orders/`):**
   - `GET /order` (Paginated list of orders).
   - `GET /order/:id` (Detailed invoice with line items).

---

### 🧩 PHASE 5: USER PROFILE, SAVED ADDRESSES & PRODUCT REVIEWS
**Goal:** Customer self-service dashboard and review system.

#### Tasks:
1. **Profile Management (`src/modules/profile/`):**
   - Profile overview via `GET /user/profile`.
   - Change Password via `PUT /user/change-password` (`{ currentPassword, newPassword, confirmPassword }`).
2. **Address Book (`src/modules/address/`):**
   - Manage shipping addresses: `GET /address`, `POST /address`, `PUT /address/:id`, `PATCH /address/:id/default`, `DELETE /address/:id`.
3. **Product Reviews (`src/modules/review/`):**
   - Public reviews component on product detail: `GET /review/product/:productId`.
   - Review submission for purchased items: `POST /review` (`{ productId, rating, comment }`).
   - Edit/Delete own review: `PUT /review/:id`, `DELETE /review/:id`.
   - Customer review history: `GET /review/me`.

---

### 🧩 PHASE 6: ROLE-BASED ACCESS CONTROL & ADMIN/STAFF DASHBOARD
**Goal:** Protected administration portal for Staff and Admin.

#### Tasks:
1. **Route Guarding (`src/routes/ProtectedRoute.jsx`):**
   - Protect admin routes based on `userType === 'EMPLOYEE'` and `position === 'ADMIN' | 'STAFF'`.
2. **Employee Management (ADMIN only):**
   - Endpoints: `GET /employee`, `POST /employee`, `GET /employee/:id`, `PUT /employee/:id`, `PATCH /employee/:id` (lock/unlock status).
3. **Product & Category Catalog Management (ADMIN & STAFF):**
   - Create/Edit/Delete products (`POST /product`, `PUT /product/:id`, `DELETE /product/:id`).
   - Category management (`POST /category`, `PUT /category/:id`, `DELETE /category/:id` - Admin only for delete).
4. **Promotion Voucher Management (ADMIN only):**
   - Endpoints: `GET /promotion`, `POST /promotion`, `PUT /promotion/:code`, `DELETE /promotion/:code`.
5. **Order Management & COD Confirmation (STAFF & ADMIN):**
   - Confirm cash on delivery: `PATCH /order/:id/confirm-cod`.

---

### 🧩 PHASE 7: POLISH, ERROR BOUNDARIES & PERFORMANCE
**Goal:** Production readiness, fluid micro-interactions, and fault tolerance.

#### Tasks:
1. Implement accessible Loading Skeletons for the Product Grid and Sidebar filters.
2. Graceful Error Boundaries and empty state graphics for search results with zero matches.
3. Toast notifications for all cart modifications, wishlist interactions, and network errors.
4. Run code validation with `npm run build` or `npx oxlint` to ensure zero syntax and runtime errors.
