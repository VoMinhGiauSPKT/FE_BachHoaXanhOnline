# TÀI LIỆU ĐẶC TẢ KỸ THUẬT API - BÁCH HÓA XANH ONLINE

> **Dành cho đội ngũ Frontend (FE) tích hợp & phát triển giao diện.**  
> Phiên bản Backend: Java Servlet 10.1 (Jakarta EE), Hibernate 6 / JPA, PostgreSQL.  
> Cập nhật lần cuối: Tháng 10/2026.

---

## 1. THÔNG TIN CHUNG & QUY CHUẨN KẾT NỐI

### 1.1. Base URL
- **Môi trường cục bộ (Local NetBeans/Tomcat):**  
  `http://localhost:8080/BachHoaXanhOnline`
- **Môi trường Triển khai Production (Docker / Render):**  
  `https://<ten-mien-render>.onrender.com` *(ứng dụng mount trực tiếp tại ROOT `/`)*

> *Gợi ý FE:* Khai báo `VITE_API_BASE_URL` hoặc `REACT_APP_API_BASE_URL` trong file `.env` của frontend để dễ dàng chuyển đổi môi trường.

---

### 1.2. Chuẩn định dạng Request & Response

- **Headers yêu cầu cho mọi request gửi body:**
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Xác thực JWT (đối với API bảo vệ):**
  ```http
  Authorization: Bearer <accessToken>
  ```
- **CORS Credentials:**
  Mọi request từ FE (Axios / Fetch) cần cấu hình `withCredentials: true` (hoặc `credentials: 'include'`) để trình duyệt tự động gửi và nhận cookie `refreshToken` (HttpOnly).

---

### 1.3. Cấu trúc phản hồi chuẩn (`ApiResponse<T>`)

Tất cả các API trong hệ thống đều trả về cấu trúc JSON đồng nhất:

```json
{
  "status": 200,
  "message": "Thông điệp kết quả",
  "data": { ... }
}
```

- `status` (*int*): Trùng khớp với mã trạng thái HTTP Header.
- `message` (*string*): Thông báo bằng tiếng Việt rõ ràng, dùng để hiển thị Toast/Alert trên UI nếu cần.
- `data` (*object | array | null*): Dữ liệu nghiệp vụ trả về. Khi thao tác xóa hoặc thông báo thuần, `data` sẽ là `null`.

#### Bảng mã trạng thái HTTP thường gặp:
| Mã HTTP | Tên chuẩn | Ý nghĩa đối với FE |
| :---: | :--- | :--- |
| **200** | `OK` | Thao tác thành công (`GET`, `PUT`, `DELETE`, `PATCH`). |
| **201** | `Created` | Tạo mới dữ liệu thành công (`POST`). |
| **400** | `Bad Request` | Dữ liệu gửi lên sai định dạng, thiếu trường bắt buộc, hoặc vi phạm validation. |
| **401** | `Unauthorized` | Chưa đăng nhập, token hết hạn hoặc không hợp lệ. FE cần kích hoạt refresh token hoặc điều hướng về `/login`. |
| **403** | `Forbidden` | Không có quyền truy cập (sai Role). Ví dụ khách hàng cố gọi API nhân viên. |
| **404** | `Not Found` | Không tìm thấy endpoint hoặc dữ liệu (ID không tồn tại). |
| **409** | `Conflict` | Xung đột dữ liệu (ví dụ: tên đăng nhập hoặc mã khuyến mãi đã tồn tại). |
| **500** | `Internal Error` | Lỗi máy chủ nội bộ. |

---

### 1.4. Phân quyền người dùng (Role-Based Access Control)

Hệ thống hỗ trợ 3 vai trò:
1. `CUSTOMER`: Khách hàng mua sắm (Quản lý giỏ hàng, đặt hàng, sổ địa chỉ, đánh giá sản phẩm).
2. `STAFF`: Nhân viên bán hàng / vận kho (Quản lý sản phẩm, danh mục, xác nhận thanh toán đơn hàng COD, kiểm duyệt đánh giá).
3. `ADMIN`: Quản trị viên tối cao (Toàn quyền hệ thống + Quản lý nhân viên nội bộ, quản lý khuyến mãi).

---

## 2. BẢNG TỔNG HỢP ROUTE API

| Nhóm chức năng | Method | Endpoint | Yêu cầu Quyền hạn |
| :--- | :---: | :--- | :--- |
| **1. Auth** | `POST` | `/auth/register` | Public |
| | `POST` | `/auth/login` | Public |
| | `POST` | `/auth/refresh` | Public (kèm Cookie `refreshToken`) |
| | `POST` | `/auth/logout` | Public (kèm Cookie `refreshToken`) |
| **2. User Profile** | `GET` | `/user/profile` | Đăng nhập (`CUSTOMER`, `STAFF`, `ADMIN`) |
| | `PUT` | `/user/change-password` | Đăng nhập (`CUSTOMER`, `STAFF`, `ADMIN`) |
| **3. Sổ địa chỉ** | `GET` | `/address` | `CUSTOMER` |
| | `POST` | `/address` | `CUSTOMER` |
| | `PUT` | `/address/:id` | `CUSTOMER` |
| | `PATCH` | `/address/:id/default` | `CUSTOMER` |
| | `DELETE` | `/address/:id` | `CUSTOMER` |
| **4. Danh mục** | `GET` | `/category` | Public |
| | `GET` | `/category/:id` | `STAFF`, `ADMIN` |
| | `POST` | `/category` | `STAFF`, `ADMIN` |
| | `PUT` | `/category/:id` | `STAFF`, `ADMIN` |
| | `DELETE` | `/category/:id` | `ADMIN` |
| **5. Sản phẩm** | `GET` | `/product` | Public *(kèm tìm kiếm, lọc, phân trang)* |
| | `GET` | `/product/:id` | Public *(chi tiết kèm điểm đánh giá)* |
| | `POST` | `/product` | `STAFF`, `ADMIN` |
| | `PUT` | `/product/:id` | `STAFF`, `ADMIN` |
| | `DELETE` | `/product/:id` | `STAFF`, `ADMIN` |
| **6. Giỏ hàng** | `GET` | `/cart` | `CUSTOMER` |
| | `POST` | `/cart/items` | `CUSTOMER` *(thêm món)* |
| | `PUT` | `/cart/items/:lineItemId`| `CUSTOMER` *(cập nhật số lượng)* |
| | `DELETE` | `/cart/items/:lineItemId`| `CUSTOMER` *(xóa 1 món)* |
| | `DELETE` | `/cart/clear` | `CUSTOMER` *(làm trống giỏ)* |
| **7. Đơn hàng** | `POST` | `/order` | `CUSTOMER` *(đặt hàng từ giỏ hàng)* |
| | `GET` | `/order` | Đăng nhập *(Khách xem đơn mình, NV xem tất cả)* |
| | `GET` | `/order/:id` | Đăng nhập *(Khách xem đơn mình, NV xem tất cả)* |
| | `PATCH` | `/order/:id/confirm-cod`| `STAFF`, `ADMIN` *(xác nhận thu tiền COD)* |
| **8. Khuyến mãi** | `GET` | `/promotion/available` | Đăng nhập (`CUSTOMER`, `STAFF`, `ADMIN`) |
| | `GET` | `/promotion` | `ADMIN` *(quản lý danh sách)* |
| | `POST` | `/promotion` | `ADMIN` *(tạo mới voucher)* |
| | `PUT` | `/promotion/:code` | `ADMIN` *(cập nhật voucher)* |
| | `DELETE` | `/promotion/:code` | `ADMIN` *(xóa voucher)* |
| **9. Đánh giá** | `GET` | `/review/product/:productId` | Public *(xem đánh giá sản phẩm)* |
| | `POST` | `/review` | `CUSTOMER` *(viết đánh giá)* |
| | `PUT` | `/review/:id` | `CUSTOMER` *(sửa đánh giá chính chủ)* |
| | `DELETE` | `/review/:id` | `CUSTOMER` (chính chủ) HOẶC `STAFF`, `ADMIN` |
| | `GET` | `/review/me` | `CUSTOMER` *(xem lịch sử đánh giá của mình)* |
| | `GET` | `/review` | `STAFF`, `ADMIN` *(kiểm duyệt đánh giá)* |
| **10. Nhân viên** | `GET` | `/employee` | `ADMIN` *(danh sách có phân trang)* |
| | `GET` | `/employee/:id` | `ADMIN` *(chi tiết nhân viên)* |
| | `POST` | `/employee` | `ADMIN` *(tạo tài khoản nhân viên)* |
| | `PUT` | `/employee/:id` | `ADMIN` *(sửa thông tin)* |
| | `PATCH` | `/employee/:id` | `ADMIN` *(khóa / mở khóa tài khoản)* |

---

## 3. CHI TIẾT TỪNG MODULE & DATA PAYLOADS

---

### MODULE 1: AUTHENTICATION (`/auth`)

#### 1.1. Đăng ký tài khoản khách hàng
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Quyền hạn:** Public
- **Request Body:**
  ```json
  {
    "username": "hoangnam",
    "fullName": "Nguyễn Hoàng Nam",
    "email": "hoangnam@example.com",
    "phoneNumber": "0912345678",
    "password": "Password123",
    "birthDate": "2000-05-15"
  }
  ```
  *Validation Rules:*
  - `username`, `fullName`, `email`, `password`: Bắt buộc không để trống.
  - `phoneNumber`: Bắt buộc đúng định dạng số ĐT VN (`0xxxxxxxxx` hoặc `+84xxxxxxxxx`).
  - `password`: Tối thiểu 6 ký tự.
  - `birthDate`: Định dạng `yyyy-MM-dd`.
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Đăng ký tài khoản thành công",
    "data": {
      "customerId": "KH000001",
      "username": "hoangnam",
      "fullName": "Nguyễn Hoàng Nam",
      "email": "hoangnam@example.com",
      "phoneNumber": "0912345678"
    }
  }
  ```

---

#### 1.2. Đăng nhập hệ thống (Dùng chung Khách hàng & Nhân viên)
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Quyền hạn:** Public
- **Request Body:**
  ```json
  {
    "username": "hoangnam",
    "password": "Password123"
  }
  ```
- **Cơ chế Cookie:** Server sẽ tự động set cookie `refreshToken` (`HttpOnly`, `Path=/`, thời hạn 7 ngày).
- **Response Success (200 OK) - Trường hợp Khách hàng (`CUSTOMER`):**
  ```json
  {
    "status": 200,
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userType": "CUSTOMER",
      "customer": {
        "customerId": "KH000001",
        "username": "hoangnam",
        "fullName": "Nguyễn Hoàng Nam"
      }
    }
  }
  ```
- **Response Success (200 OK) - Trường hợp Nhân viên / Admin (`EMPLOYEE`):**
  ```json
  {
    "status": 200,
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userType": "EMPLOYEE",
      "employee": {
        "employeeId": "NV000001",
        "username": "admin01",
        "fullName": "Trần Quản Trị",
        "position": "ADMIN" // hoặc "STAFF"
      }
    }
  }
  ```

---

#### 1.3. Cấp lại Access Token mới (Refresh Token)
- **Method:** `POST`
- **Endpoint:** `/auth/refresh`
- **Quyền hạn:** Public *(Yêu cầu có Cookie `refreshToken` trong request)*
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cấp lại Access Token thành công",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

#### 1.4. Đăng xuất
- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Quyền hạn:** Public
- **Cơ chế Cookie:** Xóa cookie `refreshToken` trên trình duyệt.
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Đăng xuất thành công",
    "data": null
  }
  ```

---

### MODULE 2: HỒ SƠ NGƯỜI DÙNG (`/user`)

#### 2.1. Lấy thông tin cá nhân đang đăng nhập
- **Method:** `GET`
- **Endpoint:** `/user/profile`
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK) - Khách hàng:**
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin tài khoản thành công",
    "data": {
      "userId": "KH000001",
      "username": "hoangnam",
      "fullName": "Nguyễn Hoàng Nam",
      "email": "hoangnam@example.com",
      "phoneNumber": "0912345678",
      "birthDate": "2000-05-15",
      "userType": "CUSTOMER",
      "addresses": [
        {
          "addressId": 1,
          "receiverName": "Nguyễn Hoàng Nam",
          "phoneNumber": "0912345678",
          "street": "123 Võ Văn Ngân",
          "ward": "Linh Chiểu",
          "city": "TP. Thủ Đức",
          "isDefault": true
        }
      ]
    }
  }
  ```
- **Response Success (200 OK) - Nhân viên:**
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin tài khoản thành công",
    "data": {
      "userId": "NV000001",
      "username": "admin01",
      "fullName": "Trần Quản Trị",
      "email": "admin@bachhoaxanh.local",
      "phoneNumber": "0987654321",
      "birthDate": "1995-08-20",
      "userType": "EMPLOYEE",
      "position": "ADMIN",
      "hireDate": "2023-01-10"
    }
  }
  ```

---

#### 2.2. Đổi mật khẩu
- **Method:** `PUT`
- **Endpoint:** `/user/change-password`
- **Header:** `Authorization: Bearer <accessToken>`
- **Request Body:**
  ```json
  {
    "currentPassword": "Password123",
    "newPassword": "NewPassword456",
    "confirmPassword": "NewPassword456"
  }
  ```
- **Response Success (200 OK):**
  *(Sau khi đổi mật khẩu thành công, refresh token bị hủy, FE nên điều hướng người dùng đăng nhập lại)*
  ```json
  {
    "status": 200,
    "message": "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
    "data": null
  }
  ```

---

### MODULE 3: SỔ ĐỊA CHỈ GIAO HÀNG (`/address`)

*Chỉ áp dụng cho vai trò `CUSTOMER`.*

#### 3.1. Danh sách địa chỉ của tôi
- **Method:** `GET`
- **Endpoint:** `/address`
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách địa chỉ thành công",
    "data": [
      {
        "addressId": 1,
        "receiverName": "Nguyễn Hoàng Nam",
        "phoneNumber": "0912345678",
        "street": "123 Võ Văn Ngân",
        "ward": "Linh Chiểu",
        "city": "TP. Thủ Đức",
        "isDefault": true
      }
    ]
  }
  ```

---

#### 3.2. Thêm địa chỉ mới
- **Method:** `POST`
- **Endpoint:** `/address`
- **Header:** `Authorization: Bearer <accessToken>`
- **Request Body:**
  ```json
  {
    "receiverName": "Nguyễn Hoàng Nam (Cơ quan)",
    "phoneNumber": "0912345678",
    "street": "456 Lê Văn Việt",
    "ward": "Tăng Nhơn Phú A",
    "city": "TP. Thủ Đức",
    "isDefault": false
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Thêm địa chỉ giao hàng thành công",
    "data": {
      "addressId": 2,
      "receiverName": "Nguyễn Hoàng Nam (Cơ quan)",
      "phoneNumber": "0912345678",
      "street": "456 Lê Văn Việt",
      "ward": "Tăng Nhơn Phú A",
      "city": "TP. Thủ Đức",
      "isDefault": false
    }
  }
  ```

---

#### 3.3. Cập nhật thông tin địa chỉ
- **Method:** `PUT`
- **Endpoint:** `/address/:id` *(Ví dụ: `/address/2`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Request Body:** *(Tương tự cấu trúc thêm mới)*
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật địa chỉ thành công",
    "data": {
      "addressId": 2,
      "receiverName": "Nguyễn Hoàng Nam (Văn phòng)",
      "phoneNumber": "0912345678",
      "street": "456 Lê Văn Việt",
      "ward": "Tăng Nhơn Phú A",
      "city": "TP. Thủ Đức",
      "isDefault": false
    }
  }
  ```

---

#### 3.4. Đặt địa chỉ làm mặc định
- **Method:** `PATCH`
- **Endpoint:** `/address/:id/default` *(Ví dụ: `/address/2/default`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Đặt địa chỉ mặc định thành công",
    "data": {
      "addressId": 2,
      "isDefault": true
    }
  }
  ```

---

#### 3.5. Xóa địa chỉ
- **Method:** `DELETE`
- **Endpoint:** `/address/:id` *(Ví dụ: `/address/2`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xóa địa chỉ thành công",
    "data": null
  }
  ```

---

### MODULE 4: DANH MỤC SẢN PHẨM (`/category`)

#### 4.1. Lấy danh sách danh mục (Menu / Bộ lọc)
- **Method:** `GET`
- **Endpoint:** `/category`
- **Quyền hạn:** Public
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách loại sản phẩm thành công",
    "data": [
      {
        "categoryId": "DM01",
        "categoryName": "Rau củ & Trái cây"
      },
      {
        "categoryId": "DM02",
        "categoryName": "Thịt, Cá, Trứng, Hải sản"
      },
      {
        "categoryId": "DM03",
        "categoryName": "Đồ uống & Sữa"
      }
    ]
  }
  ```

---

#### 4.2. Chi tiết danh mục (Admin / Staff)
- **Method:** `GET`
- **Endpoint:** `/category/:id` *(Ví dụ: `/category/DM01`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin chi tiết loại sản phẩm thành công",
    "data": {
      "categoryId": "DM01",
      "categoryName": "Rau củ & Trái cây",
      "profitMargin": 15.0,
      "deleted": false
    }
  }
  ```

---

#### 4.3. Tạo danh mục mới
- **Method:** `POST`
- **Endpoint:** `/category`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "categoryId": "DM04", // Tùy chọn (nếu để trống hệ thống tự sinh)
    "categoryName": "Bánh kẹo & Đồ ăn vặt",
    "profitMargin": 20.0
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Thêm mới loại sản phẩm thành công",
    "data": {
      "categoryId": "DM04",
      "categoryName": "Bánh kẹo & Đồ ăn vặt",
      "profitMargin": 20.0,
      "deleted": false
    }
  }
  ```

---

#### 4.4. Cập nhật danh mục
- **Method:** `PUT`
- **Endpoint:** `/category/:id` *(Ví dụ: `/category/DM04`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "categoryName": "Bánh kẹo, Đồ ăn vặt cao cấp",
    "profitMargin": 22.5
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật loại sản phẩm thành công",
    "data": {
      "categoryId": "DM04",
      "categoryName": "Bánh kẹo, Đồ ăn vặt cao cấp",
      "profitMargin": 22.5,
      "deleted": false
    }
  }
  ```

---

#### 4.5. Xóa danh mục
- **Method:** `DELETE`
- **Endpoint:** `/category/:id` *(Ví dụ: `/category/DM04`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN` only)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xóa loại sản phẩm thành công",
    "data": null
  }
  ```

---

### MODULE 5: QUẢN LÝ SẢN PHẨM (`/product`)

#### 5.1. Danh sách sản phẩm (Tìm kiếm, Phân trang, Lọc)
- **Method:** `GET`
- **Endpoint:** `/product`
- **Quyền hạn:** Public
- **Query Parameters:**
  - `page`: Số trang (mặc định: `1`)
  - `limit`: Số sản phẩm mỗi trang (mặc định: `12`)
  - `keyword`: Từ khóa tìm theo tên sản phẩm
  - `categoryId`: Lọc theo mã danh mục (ví dụ `DM01`)
  - `sortBy`: Tiêu chí sắp xếp (`price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`)
  - `inStock`: Lọc còn hàng (`true` hoặc `false`)
- **Ví dụ gọi:** `/product?page=1&limit=12&keyword=Vinamilk&sortBy=price_asc`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách sản phẩm thành công",
    "data": {
      "total": 35,
      "page": 1,
      "limit": 12,
      "products": [
        {
          "productId": "SP000001",
          "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
          "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg",
          "category": {
            "categoryId": "DM03",
            "categoryName": "Đồ uống & Sữa"
          },
          "price": 37500,
          "unit": "Hộp",
          "stock": 120,
          "expiryDate": "2026-12-31"
        }
      ]
    }
  }
  ```

---

#### 5.2. Chi tiết sản phẩm
- **Method:** `GET`
- **Endpoint:** `/product/:id` *(Ví dụ: `/product/SP000001`)*
- **Quyền hạn:** Public
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy chi tiết sản phẩm thành công",
    "data": {
      "productId": "SP000001",
      "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
      "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg",
      "category": {
        "categoryId": "DM03",
        "categoryName": "Đồ uống & Sữa"
      },
      "supplier": {
        "supplierId": "NCC001",
        "supplierName": "Công ty Cổ phần Sữa Việt Nam (Vinamilk)"
      },
      "price": 37500,
      "vat": 10.0,
      "unit": "Hộp",
      "stock": 120,
      "expiryDate": "2026-12-31",
      "ratingAverage": 4.8,
      "totalReviews": 42
    }
  }
  ```

---

#### 5.3. Thêm sản phẩm mới (Admin / Staff)
- **Method:** `POST`
- **Endpoint:** `/product`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "productId": "SP000002", // Tùy chọn (tự sinh nếu null)
    "productName": "Gạo ST25 Ông Cua Túi 5kg",
    "imageUrl": "https://cdn.bachhoaxanh.com/images/gao-st25.jpg",
    "expiryDate": "2027-06-30",
    "categoryId": "DM04",
    "supplierId": "NCC002",
    "importPrice": 160000,
    "vat": 5.0,
    "sellingPrice": 210000,
    "unit": "Túi",
    "quantity": 80
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Thêm sản phẩm thành công",
    "data": {
      "productId": "SP000002",
      "productName": "Gạo ST25 Ông Cua Túi 5kg",
      "sellingPrice": 210000,
      "quantity": 80,
      "unit": "Túi",
      "expiryDate": "2027-06-30"
    }
  }
  ```

---

#### 5.4. Cập nhật thông tin sản phẩm
- **Method:** `PUT`
- **Endpoint:** `/product/:id` *(Ví dụ: `/product/SP000002`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "productName": "Gạo ST25 Ông Cua Chính Hãng 5kg",
    "imageUrl": "https://cdn.bachhoaxanh.com/images/gao-st25-updated.jpg",
    "categoryId": "DM04",
    "supplierId": "NCC002",
    "unit": "Túi",
    "expiryDate": "2027-07-31"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật sản phẩm thành công",
    "data": {
      "productId": "SP000002",
      "productName": "Gạo ST25 Ông Cua Chính Hãng 5kg",
      "imageUrl": "https://cdn.bachhoaxanh.com/images/gao-st25-updated.jpg",
      "unit": "Túi",
      "expiryDate": "2027-07-31"
    }
  }
  ```

---

#### 5.5. Xóa sản phẩm (Soft delete)
- **Method:** `DELETE`
- **Endpoint:** `/product/:id` *(Ví dụ: `/product/SP000002`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xóa sản phẩm thành công",
    "data": null
  }
  ```

---

### MODULE 6: GIỎ HÀNG (`/cart`)

*Chỉ áp dụng cho vai trò `CUSTOMER`.*

#### 6.1. Xem giỏ hàng hiện tại
- **Method:** `GET`
- **Endpoint:** `/cart`
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin giỏ hàng thành công",
    "data": {
      "cartId": "GH_KH000001",
      "totalItems": 2,
      "totalAmount": 75000,
      "items": [
        {
          "lineItemId": 101,
          "productId": "SP000001",
          "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
          "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg",
          "unit": "Hộp",
          "price": 37500,
          "quantity": 2,
          "itemTotal": 75000,
          "availableStock": 120
        }
      ]
    }
  }
  ```

---

#### 6.2. Thêm sản phẩm vào giỏ hàng
- **Method:** `POST`
- **Endpoint:** `/cart/items`
- **Header:** `Authorization: Bearer <accessToken>`
- **Request Body:**
  ```json
  {
    "productId": "SP000001",
    "quantity": 1
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Thêm vào giỏ hàng thành công",
    "data": {
      "cartId": "GH_KH000001",
      "lineItemId": 101,
      "productId": "SP000001",
      "quantity": 3,
      "itemTotal": 112500,
      "totalCartAmount": 112500
    }
  }
  ```

---

#### 6.3. Cập nhật số lượng mặt hàng trong giỏ
- **Method:** `PUT`
- **Endpoint:** `/cart/items/:lineItemId` *(Ví dụ: `/cart/items/101`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Request Body:**
  ```json
  {
    "quantity": 4
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật số lượng thành công",
    "data": {
      "lineItemId": 101,
      "productId": "SP000001",
      "quantity": 4,
      "itemTotal": 150000,
      "totalCartAmount": 150000
    }
  }
  ```

---

#### 6.4. Xóa một mặt hàng khỏi giỏ
- **Method:** `DELETE`
- **Endpoint:** `/cart/items/:lineItemId` *(Ví dụ: `/cart/items/101`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  *(Trả về toàn bộ trạng thái giỏ hàng sau khi xóa)*
  ```json
  {
    "status": 200,
    "message": "Đã xóa sản phẩm khỏi giỏ hàng",
    "data": {
      "cartId": "GH_KH000001",
      "totalItems": 0,
      "totalAmount": 0,
      "items": []
    }
  }
  ```

---

#### 6.5. Làm trống giỏ hàng (Xóa toàn bộ)
- **Method:** `DELETE`
- **Endpoint:** `/cart/clear`
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Đã làm trống giỏ hàng",
    "data": {
      "cartId": "GH_KH000001",
      "totalItems": 0,
      "totalAmount": 0,
      "items": []
    }
  }
  ```

---

### MODULE 7: ĐƠN HÀNG & THANH TOÁN (`/order`)

#### 7.1. Đặt hàng từ giỏ hàng hiện tại (Checkout)
- **Method:** `POST`
- **Endpoint:** `/order`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `CUSTOMER` only)
- **Mô tả:** Hệ thống tự động chuyển các mặt hàng trong giỏ của khách thành đơn hàng mới, trừ tồn kho và làm rỗng giỏ hàng. Phương thức thanh toán mặc định: `COD`.
- **Request Body:**
  ```json
  {
    "tenNguoiNhan": "Nguyễn Hoàng Nam",
    "soDienThoaiNhan": "0912345678",
    "diaChiGiaoHang": "123 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức"
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Đặt hàng thành công",
    "data": {
      "maDonHang": "DH20261009001",
      "maKhachHang": "KH000001",
      "ngayLap": "2026-10-09T14:45:00",
      "tongTien": 150000,
      "trangThai": "PENDING",
      "phuongThucTT": "COD",
      "tenNguoiNhan": "Nguyễn Hoàng Nam",
      "soDienThoaiNhan": "0912345678",
      "diaChiGiaoHang": "123 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức",
      "items": [
        {
          "lineItemId": 101,
          "productId": "SP000001",
          "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
          "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg",
          "unit": "Hộp",
          "price": 37500,
          "quantity": 4,
          "itemTotal": 150000,
          "availableStock": 116
        }
      ]
    }
  }
  ```

---

#### 7.2. Lấy danh sách đơn hàng
- **Method:** `GET`
- **Endpoint:** `/order`
- **Header:** `Authorization: Bearer <accessToken>`
- **Quyền hạn:**
  - Nếu là `CUSTOMER`: Trả về danh sách đơn hàng của chính tài khoản đó.
  - Nếu là `STAFF` hoặc `ADMIN`: Trả về toàn bộ danh sách đơn hàng của hệ thống.
- **Query Parameters:** `page` (mặc định: 1), `limit` (mặc định: 10).
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách đơn hàng thành công",
    "data": {
      "currentPage": 1,
      "totalPages": 2,
      "items": [
        {
          "maDonHang": "DH20261009001",
          "ngayLap": "2026-10-09T14:45:00",
          "tongTien": 150000,
          "trangThai": "PENDING",
          "soLuongMatHang": 1
        }
      ]
    }
  }
  ```

---

#### 7.3. Chi tiết đơn hàng
- **Method:** `GET`
- **Endpoint:** `/order/:id` *(Ví dụ: `/order/DH20261009001`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Response Success (200 OK):**
  *(Cấu trúc dữ liệu chi tiết tương tự response của API 7.1)*

---

#### 7.4. Xác nhận thu tiền COD khi giao thành công (Staff / Admin)
- **Method:** `PATCH`
- **Endpoint:** `/order/:id/confirm-cod` *(Ví dụ: `/order/DH20261009001/confirm-cod`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xác nhận thanh toán COD thành công",
    "data": {
      "maDonHang": "DH20261009001",
      "maKhachHang": "KH000001",
      "ngayLap": "2026-10-09T14:45:00",
      "tongTien": 150000,
      "trangThai": "COMPLETED",
      "phuongThucTT": "COD",
      "tenNguoiNhan": "Nguyễn Hoàng Nam",
      "soDienThoaiNhan": "0912345678",
      "diaChiGiaoHang": "123 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức",
      "items": [ ... ]
    }
  }
  ```

---

### MODULE 8: KHUYẾN MÃI & MÃ GIẢM GIÁ (`/promotion`)

#### 8.1. Kiểm tra khuyến mãi khả dụng theo giỏ hàng
- **Method:** `GET`
- **Endpoint:** `/promotion/available`
- **Header:** `Authorization: Bearer <accessToken>`
- **Query Parameter:** `totalAmount` *(Tổng tiền đơn hàng hiện tại của khách, ví dụ: `?totalAmount=250000`)*
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách mã khuyến mãi khả dụng thành công",
    "data": [
      {
        "promotionCode": "GIAM20K",
        "promotionName": "Giảm 20.000đ đơn từ 200k",
        "description": "Chương trình ưu đãi tháng 10",
        "discountType": "FIXED", // hoặc "PERCENT"
        "discountValue": 20000.0,
        "minOrderAmount": 200000.0,
        "maxDiscount": 20000.0,
        "estimatedDiscount": 20000.0,
        "isEligible": true,
        "unmetReason": null
      },
      {
        "promotionCode": "VIP50K",
        "promotionName": "Giảm 50.000đ đơn từ 500k",
        "description": "Ưu đãi đơn lớn",
        "discountType": "FIXED",
        "discountValue": 50000.0,
        "minOrderAmount": 500000.0,
        "maxDiscount": 50000.0,
        "estimatedDiscount": 0.0,
        "isEligible": false,
        "unmetReason": "Đơn hàng chưa đạt giá trị tối thiểu 500.000đ"
      }
    ]
  }
  ```

---

#### 8.2. Quản lý danh sách khuyến mãi (Admin)
- **Method:** `GET`
- **Endpoint:** `/promotion`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN` only)
- **Query Parameters:** `keyword`, `type`, `page`, `limit`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách khuyến mãi thành công",
    "data": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "promotions": [
        {
          "promotionCode": "GIAM20K",
          "promotionName": "Giảm 20.000đ đơn từ 200k",
          "discountType": "FIXED",
          "discountValue": 20000.0,
          "maxDiscount": 20000.0,
          "minOrderAmount": 200000.0,
          "remainingUsage": 95,
          "startDate": "2026-10-01",
          "endDate": "2026-10-31",
          "isDeleted": false,
          "status": "ACTIVE"
        }
      ]
    }
  }
  ```

---

#### 8.3. Tạo chương trình khuyến mãi mới
- **Method:** `POST`
- **Endpoint:** `/promotion`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN` only)
- **Request Body:**
  ```json
  {
    "promotionCode": "BANMOI10",
    "promotionName": "Giảm 10% cho bạn mới",
    "description": "Áp dụng khách hàng đăng ký lần đầu",
    "discountType": "PERCENT", // "PERCENT" hoặc "FIXED"
    "discountValue": 10.0,
    "maxDiscount": 30000.0,
    "minOrderAmount": 100000.0,
    "usageLimit": 200,
    "startDate": "2026-10-01",
    "endDate": "2026-11-30"
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Tạo chương trình khuyến mãi thành công",
    "data": {
      "promotionCode": "BANMOI10",
      "promotionName": "Giảm 10% cho bạn mới",
      "discountType": "PERCENT",
      "discountValue": 10.0,
      "maxDiscount": 30000.0,
      "remainingUsage": 200
    }
  }
  ```

---

#### 8.4. Cập nhật khuyến mãi
- **Method:** `PUT`
- **Endpoint:** `/promotion/:code` *(Ví dụ: `/promotion/BANMOI10`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN` only)
- **Request Body:**
  ```json
  {
    "promotionName": "Giảm 10% tri ân khách hàng mới",
    "description": "Gia hạn thêm thời gian áp dụng",
    "remainingUsage": 300,
    "endDate": "2026-12-31"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật khuyến mãi thành công",
    "data": {
      "promotionCode": "BANMOI10",
      "promotionName": "Giảm 10% tri ân khách hàng mới",
      "remainingUsage": 300,
      "endDate": "2026-12-31"
    }
  }
  ```

---

#### 8.5. Xóa khuyến mãi
- **Method:** `DELETE`
- **Endpoint:** `/promotion/:code` *(Ví dụ: `/promotion/BANMOI10`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN` only)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xóa chương trình khuyến mãi thành công",
    "data": null
  }
  ```

---

### MODULE 9: ĐÁNH GIÁ SẢN PHẨM (`/review`)

#### 9.1. Lấy danh sách đánh giá công khai của 1 sản phẩm
- **Method:** `GET`
- **Endpoint:** `/review/product/:productId` *(Ví dụ: `/review/product/SP000001`)*
- **Quyền hạn:** Public
- **Query Parameters:** `page` (mặc định: 1), `limit` (mặc định: 5), `rating` (tùy chọn: 1 đến 5 sao).
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách đánh giá sản phẩm thành công",
    "data": {
      "summary": {
        "averageRating": 4.67,
        "totalReviews": 3,
        "starCounts": {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 1,
          "5": 2
        }
      },
      "page": 1,
      "limit": 5,
      "reviews": [
        {
          "reviewId": 1,
          "rating": 5,
          "comment": "Sữa ngon, date xa, đóng gói cẩn thận!",
          "createdAt": "2026-10-08 14:20:00",
          "customer": {
            "fullName": "Nguyễn Hoàng Nam",
            "username": "hoangnam"
          }
        }
      ]
    }
  }
  ```

---

#### 9.2. Gửi đánh giá sản phẩm
- **Method:** `POST`
- **Endpoint:** `/review`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `CUSTOMER` only)
- **Request Body:**
  ```json
  {
    "productId": "SP000001",
    "rating": 5,
    "comment": "Rất hài lòng về chất lượng giao hàng nhanh."
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Gửi đánh giá thành công",
    "data": {
      "reviewId": 2,
      "productId": "SP000001",
      "rating": 5,
      "comment": "Rất hài lòng về chất lượng giao hàng nhanh.",
      "createdAt": "2026-10-09 15:00:00"
    }
  }
  ```

---

#### 9.3. Cập nhật bài đánh giá (Chính chủ)
- **Method:** `PUT`
- **Endpoint:** `/review/:id` *(Ví dụ: `/review/2`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `CUSTOMER` chính chủ)
- **Request Body:**
  ```json
  {
    "rating": 4,
    "comment": "Giao hơi trễ 15 phút nhưng sản phẩm vẫn tươi nguyên."
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật đánh giá thành công",
    "data": {
      "reviewId": 2,
      "productId": "SP000001",
      "rating": 4,
      "comment": "Giao hơi trễ 15 phút nhưng sản phẩm vẫn tươi nguyên.",
      "updatedAt": "2026-10-09 15:15:00"
    }
  }
  ```

---

#### 9.4. Xóa đánh giá
- **Method:** `DELETE`
- **Endpoint:** `/review/:id` *(Ví dụ: `/review/2`)*
- **Header:** `Authorization: Bearer <accessToken>`
- **Quyền hạn:** Khách hàng chính chủ HOẶC Nhân viên (`STAFF`, `ADMIN`) kiểm duyệt.
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Xóa đánh giá thành công",
    "data": null
  }
  ```

---

#### 9.5. Lịch sử đánh giá của khách hàng (My Reviews)
- **Method:** `GET`
- **Endpoint:** `/review/me`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `CUSTOMER` only)
- **Query Parameters:** `page`, `limit`, `rating`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy lịch sử đánh giá của tôi thành công",
    "data": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "reviews": [
        {
          "reviewId": 2,
          "rating": 4,
          "comment": "Giao hơi trễ 15 phút nhưng sản phẩm vẫn tươi nguyên.",
          "createdAt": "2026-10-09 15:00:00",
          "product": {
            "productId": "SP000001",
            "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
            "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg",
            "unit": "Hộp"
          }
        }
      ]
    }
  }
  ```

---

#### 9.6. Danh sách kiểm duyệt đánh giá (Admin / Staff)
- **Method:** `GET`
- **Endpoint:** `/review`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `STAFF`, `ADMIN`)
- **Query Parameters:** `isDeleted` (true/false), `productId`, `customerId`, `rating`, `keyword`, `page`, `limit`
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách kiểm duyệt đánh giá thành công",
    "data": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "reviews": [
        {
          "reviewId": 2,
          "rating": 4,
          "comment": "Giao hơi trễ 15 phút nhưng sản phẩm vẫn tươi nguyên.",
          "createdAt": "2026-10-09 15:00:00",
          "isDeleted": false,
          "customer": {
            "customerId": "KH000001",
            "fullName": "Nguyễn Hoàng Nam",
            "username": "hoangnam",
            "phoneNumber": "0912345678"
          },
          "product": {
            "productId": "SP000001",
            "productName": "Sữa tươi tiệt trùng Vinamilk Có đường 1L",
            "imageUrl": "https://cdn.bachhoaxanh.com/images/vinamilk-1l.jpg"
          }
        }
      ]
    }
  }
  ```

---

### MODULE 10: QUẢN LÝ NHÂN VIÊN (`/employee`)

*Chỉ áp dụng cho vai trò `ADMIN` tối cao.*

#### 10.1. Danh sách nhân viên
- **Method:** `GET`
- **Endpoint:** `/employee`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN`)
- **Query Parameters:** `page`, `limit`, `keyword`, `position` (`STAFF`/`ADMIN`), `status` (`true`/`false`)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách nhân viên thành công",
    "data": {
      "total": 4,
      "page": 1,
      "limit": 10,
      "employees": [
        {
          "employeeId": "NV000002",
          "fullName": "Lê Văn Kho",
          "username": "staff_kho",
          "email": "staffkho@bachhoaxanh.local",
          "phoneNumber": "0987654321",
          "position": "STAFF",
          "hireDate": "2024-02-15",
          "status": true
        }
      ]
    }
  }
  ```

---

#### 10.2. Chi tiết nhân viên
- **Method:** `GET`
- **Endpoint:** `/employee/:id` *(Ví dụ: `/employee/NV000002`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN`)
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Lấy chi tiết nhân viên thành công",
    "data": {
      "employeeId": "NV000002",
      "fullName": "Lê Văn Kho",
      "username": "staff_kho",
      "email": "staffkho@bachhoaxanh.local",
      "phoneNumber": "0987654321",
      "birthDate": "1997-04-10",
      "position": "STAFF",
      "hireDate": "2024-02-15",
      "status": true
    }
  }
  ```

---

#### 10.3. Tạo tài khoản nhân viên mới
- **Method:** `POST`
- **Endpoint:** `/employee`
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN`)
- **Request Body:**
  ```json
  {
    "fullName": "Võ Thu Ngân",
    "username": "staff_thungan",
    "password": "Password123",
    "phoneNumber": "0933112233",
    "position": "STAFF" // "STAFF" hoặc "ADMIN"
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "status": 201,
    "message": "Tạo nhân viên thành công",
    "data": {
      "employeeId": "NV000003",
      "fullName": "Võ Thu Ngân",
      "username": "staff_thungan",
      "phoneNumber": "0933112233",
      "position": "STAFF",
      "status": true
    }
  }
  ```

---

#### 10.4. Cập nhật thông tin nhân viên
- **Method:** `PUT`
- **Endpoint:** `/employee/:id` *(Ví dụ: `/employee/NV000003`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN`)
- **Request Body:**
  ```json
  {
    "fullName": "Võ Thị Thu Ngân",
    "email": "thungan@bachhoaxanh.local",
    "phoneNumber": "0933112233",
    "birthDate": "1999-11-20",
    "position": "STAFF",
    "newPassword": "NewPassword123" // Tùy chọn đặt lại mật khẩu
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật thông tin nhân viên thành công",
    "data": {
      "employeeId": "NV000003",
      "fullName": "Võ Thị Thu Ngân",
      "username": "staff_thungan",
      "email": "thungan@bachhoaxanh.local",
      "phoneNumber": "0933112233",
      "position": "STAFF",
      "status": true
    }
  }
  ```

---

#### 10.5. Khóa / Mở khóa tài khoản nhân viên
- **Method:** `PATCH`
- **Endpoint:** `/employee/:id` *(Ví dụ: `/employee/NV000003`)*
- **Header:** `Authorization: Bearer <accessToken>` (Role: `ADMIN`)
- **Lưu ý:** Admin không được phép tự khóa tài khoản của chính mình.
- **Request Body:**
  ```json
  {
    "status": false // false: Khóa tài khoản, true: Kích hoạt lại
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": 200,
    "message": "Cập nhật trạng thái nhân viên thành công",
    "data": {
      "employeeId": "NV000003",
      "status": false
    }
  }
  ```

---

## 4. HƯỚNG DẪN CODE INTERCEPTOR & AUTH FLOW CHO FRONTEND

### 4.1. Cấu hình Axios Client mẫu (TypeScript / JavaScript)

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/BachHoaXanhOnline',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Bắt buộc để trình duyệt gửi kèm HttpOnly Cookie refreshToken
});

// Request Interceptor: Tự động đính kèm Access Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Tự động refresh token khi nhận HTTP 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token (cookie refreshToken tự động gửi kèm)
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh hết hạn -> Đăng xuất người dùng
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

### 4.2. Lưu ý quan trọng cho Frontend
1. **Lưu trữ Token:** Lưu `accessToken` trong `localStorage` hoặc `Pinia / Redux store`. Không cần lưu `refreshToken` vì cookie HttpOnly được trình duyệt quản lý tự động, bảo mật chống XSS.
2. **Quyền truy cập:**
   - Dựa vào trường `userType` (`CUSTOMER` hoặc `EMPLOYEE`) và `position` (`ADMIN` hoặc `STAFF`) trong response của `/auth/login` để phân hướng trang:
     - Khách hàng: Chuyển hướng sang trang chủ `/` hoặc `/cart`.
     - Nhân viên / Admin: Chuyển hướng sang `/admin` hoặc `/staff/dashboard`.
3. **Hiển thị lỗi Toast:** Khi nhận `status >= 400`, lấy trực tiếp chuỗi `error.response.data.message` để hiển thị popup thông báo lỗi cho người dùng.
