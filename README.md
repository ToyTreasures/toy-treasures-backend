# 🧸 Toy Treasures Backend

## 📌 Overview

**Toy Treasures Backend** is a RESTful API server that powers the e-commerce marketplace for buying, selling, and managing toys and collectibles. It enables user authentication, item listing, image uploads, wishlists, and contact forms using a modular, secure, and scalable Node.js architecture.

---

## 🎯 Purpose and Scope

This project serves as the backend foundation for the Toy Treasures platform, handling:

- User registration and login
- Product listing, browsing, and management
- Wishlist functionality
- Image management via ImageKit
- User support messages

> For environment setup and running the server, see the `Getting Started` section (not included here).  
> For details on security and validation, refer to the `Authentication & Security` documentation.

---

## 🏗️ System Architecture

The application follows a **layered architecture** with clear separation between:

- **Presentation Layer** (Express routes/controllers)
- **Business Logic Layer** (Controllers/services)
- **Data Access Layer** (Repositories with Mongoose)

### 🔌 Application Bootstrap

- Entry point: `src/index.js`
- Uses **constructor-based dependency injection**
- Initializes repositories, injects dependencies into controllers
- Mounts routers with appropriate middleware

---

## 🧩 Core Business Domains

| Domain        | Route Prefix         | Controller           | Purpose                                |
|---------------|----------------------|-----------------------|----------------------------------------|
| Authentication| `/api/v1/auth`       | `AuthController`      | Register, login, token handling         |
| Users         | `/api/v1/users`      | `UserController`      | Profile editing, account operations     |
| Items         | `/api/v1/items`      | `ItemController`      | Listing, updating, searching items      |
| Categories    | `/api/v1/categories` | `CategoryController`  | Item categorization and grouping        |
| Wishlist      | `/api/v1/wishlist`   | `WishlistController`  | Favorite item management                |
| Contact       | `/api/v1/contact-us` | `ContactUsController` | Contact form and user inquiries         |

---

## 🧪 Technology Stack

| Technology     | Purpose                                | Version     |
|----------------|----------------------------------------|-------------|
| **Node.js**    | Runtime environment                    | `>=18`      |
| **Express.js** | Web application framework              | `^4.19.2`   |
| **MongoDB**    | Primary database                       | -           |
| **Mongoose**   | MongoDB object modeling                | `^8.6.1`    |
| **bcrypt**     | Password hashing                       | `^5.1.1`    |
| **jsonwebtoken**| Token authentication (JWT)           | `^9.0.2`    |
| **joi**        | Request schema validation              | `^17.13.3`  |
| **ImageKit**   | Image upload and CDN                   | `^5.2.0`    |
| **nodemailer** | Email handling                         | `^6.9.15`   |
| **multer**     | File uploads                           | `^1.4.5-lts.1` |

---

## 🛡️ Middleware Stack

The backend uses a rich middleware pipeline for cross-cutting concerns:

- CORS configuration
- Body parsing and file uploads
- Rate limiting (`express-rate-limit`)
- Logging
- Error handling
- Authentication (JWT middleware)

---

## 🌐 External Integrations

| Service       | Purpose                         |
|---------------|----------------------------------|
| **MongoDB**   | Stores users, items, wishlist data |
| **ImageKit**  | Image hosting & CDN for media     |
| **Nodemailer**| Email notifications (SMTP)        |
| **Rate Limiter** | API rate protection            |

---

## 🔁 Request Flow Architecture

Each HTTP request passes through the following steps:

1. **Middleware Stack:** Validation, CORS, logging, etc.
2. **Routing Layer:** Routes matched by Express
3. **Controllers:** Contain core business logic
4. **Repositories:** Abstract DB access using Mongoose
5. **Models:** MongoDB data structure definitions
6. **Response Generation:** API responses with status codes and JSON structure

---

## ✅ Summary

The Toy Treasures backend is a production-grade API server built with modern best practices:

- Modular and testable architecture
- Secure authentication and validation
- Clean separation of business domains
- Scalable structure for future growth

> 📮 For contributions, issues, or enhancements, feel free to open a pull request or start a discussion.
