# guzel-meraki-studio
# 🌸 Guzel Meraki Studio

Guzel Meraki Studio is a modern full-stack e-commerce and event decor management platform built for a creative decor and gifting business.

The platform allows customers to browse products, manage their cart, create accounts, place orders, proceed through checkout and payment, while administrators can manage products, categories, orders and event enquiries through a dedicated admin dashboard.

---

## 📌 Project Overview

Guzel Meraki Studio was developed as a full-stack web development internship project.

The application provides two main experiences:

### 👤 Customer Side

Customers can:

- Browse available products
- View product details
- Select product variants
- Add products to cart
- Update cart quantities
- Create an account
- Login securely
- Proceed to checkout
- Enter delivery information
- Place orders
- Proceed to payment
- View their account
- View their order history
- Receive payment/order confirmation through email

### 🔐 Admin Side

Administrators can:

- Access a protected admin dashboard
- View total orders
- View listed products
- View new event enquiries
- View paid revenue
- Manage orders
- Update order status
- Manage products
- Manage product categories
- Manage event enquiries
- View customer/order information

---

# 🚀 Main Features

## 🛍️ E-Commerce Features

- Product catalogue
- Product categories
- Product details
- Product variants
- Product pricing
- Stock management
- Shopping cart
- Checkout
- Order creation
- Order status management
- Customer order history

---

## 👤 Authentication & Authorization

The project implements authentication using:

- JWT
- HTTP-only cookies
- Password hashing with bcrypt
- Role-based authorization

There are two user roles:

```text
CUSTOMER
ADMIN
```

### Customer Authentication

Customers can:

- Register
- Login
- Logout
- Access their account
- View their orders

### Admin Authentication

Administrators have access to:

```text
/admin
/admin/orders
/admin/products
/admin/categories
/admin/enquiries
```

Admin routes are protected using authentication and role verification.

---

# 💳 Payment System

The project includes a payment flow designed around **Safepay**.

The checkout flow is:

```text
Customer
   ↓
Cart
   ↓
Checkout
   ↓
Create Order
   ↓
Payment Initiation
   ↓
Safepay Checkout
   ↓
Payment Verification
   ↓
Order Status
```

Payment attempts are also stored in the database for tracking and auditing.

The database contains a dedicated:

```text
PaymentAttempt
```

model for recording payment gateway information and payment status.

Supported payment states include:

```text
INITIATED
PENDING
SUCCESS
FAILED
```

---

# 📧 Email Notifications

Email notification functionality is implemented using **Nodemailer**.

When an order payment is confirmed/marked as paid, the system can send a payment confirmation email to the customer's email address.

The email contains information such as:

- Customer name
- Order number
- Payment status
- Total amount
- Order processing confirmation

SMTP credentials are stored in environment variables and are not committed to GitHub.

---

# 🖼️ Image Management

The project is designed to use **Cloudinary** for product and category images.

Cloudinary is used for:

- Product images
- Category images
- Cloud-hosted image URLs

The database stores image URLs rather than storing image files directly inside PostgreSQL.

Example:

```text
Product
 ├── images[]
 └── Category
      └── imageUrl
```

---

# 🛠️ Technology Stack

## Frontend

### Next.js

The project uses **Next.js** with the App Router architecture.

Next.js handles:

- Page routing
- Server Components
- Client Components
- API routes
- Server-side authentication checks
- Full-stack application structure

---

### React

React is used for building the user interface and interactive components.

Examples include:

- Product interfaces
- Shopping cart
- Checkout form
- Login/register forms
- Admin management interfaces

---

### TypeScript

The project is written primarily in TypeScript.

File extensions include:

```text
.ts
.tsx
```

TypeScript provides:

- Static typing
- Better development experience
- Safer API/data handling
- Improved code maintainability

---

### Tailwind CSS

Tailwind CSS is used for styling the application.

It provides:

- Responsive layouts
- Utility-based styling
- Consistent spacing
- Responsive design
- Custom colour palette
- Modern UI components

---

### Lucide React

Lucide React is used for interface icons.

Examples include:

- Dashboard icon
- Shopping bag
- Products
- Categories
- Logout
- Messages
- Arrow icons

---

# 🗄️ Backend

The backend functionality is handled inside the Next.js application.

Next.js API routes are used for backend operations such as:

```text
/api/auth/login
/api/auth/register
/api/auth/logout
/api/orders
/api/orders/[id]
/api/payments/initiate
```

These API routes communicate with the database and handle authentication, orders and payment-related operations.

---

# 🧠 Database

## PostgreSQL

The application uses PostgreSQL as its relational database.

The production/development database is hosted using:

### Neon

Neon provides the PostgreSQL database infrastructure used by the project.

---

## Prisma ORM

Prisma is used as the Object Relational Mapper (ORM).

Prisma provides:

- Database schema management
- Type-safe database queries
- Database relationships
- CRUD operations
- Migration support

---

# 🗃️ Database Models

The project contains the following main database models:

```text
User
Category
Product
ProductVariant
Order
OrderItem
PaymentAttempt
EventEnquiry
```

---

## User

Stores customer and admin account information.

Important fields include:

```text
id
name
email
password
phone
role
createdAt
updatedAt
```

Roles:

```text
CUSTOMER
ADMIN
```

---

## Category

Stores product categories.

Fields include:

```text
id
name
slug
description
imageUrl
createdAt
```

---

## Product

Stores products available in the store.

Fields include:

```text
id
name
slug
description
price
images
stock
status
categoryId
createdAt
updatedAt
```

Product statuses include:

```text
ACTIVE
INACTIVE
OUT_OF_STOCK
```

---

## Product Variant

Supports variations such as:

```text
Size
Color
```

Each variant can have:

- Name
- Value
- Price modifier
- Stock

---

## Order

Stores customer orders.

Important information includes:

```text
orderNumber
status
totalAmount
customerName
customerEmail
customerPhone
deliveryAddress
notes
```

Order statuses include:

```text
PENDING
PAID
FAILED
CANCELLED
SHIPPED
DELIVERED
```

---

## OrderItem

Stores individual products belonging to an order.

It records:

- Product
- Quantity
- Purchase price
- Product variant

The price is stored as a snapshot so that historical orders are not affected by future product price changes.

---

## PaymentAttempt

Stores payment attempt information.

It includes:

```text
gateway
status
transactionId
rawResponse
orderId
createdAt
updatedAt
```

This allows payment attempts to be recorded for auditing and troubleshooting.

---

## EventEnquiry

Stores event decoration enquiries.

Customers can submit information such as:

- Name
- Email
- Phone
- Event type
- Event date
- Guest count
- Message

Supported event types:

```text
WEDDING
BIRTHDAY
CORPORATE
CUSTOM
```

Enquiry statuses:

```text
NEW
CONTACTED
CONFIRMED
CLOSED
```

---

# 🔐 Security

Several security practices are implemented in the application.

### Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

Passwords are never stored as plain text.

---

### JWT Authentication

JSON Web Tokens are used for authentication.

Tokens contain information such as:

```text
user ID
email
role
```

---

### HTTP-only Cookies

Authentication tokens are stored in HTTP-only cookies.

This prevents client-side JavaScript from directly accessing the authentication token.

---

### Role-Based Access Control

Admin routes verify that the authenticated user has:

```text
role === "ADMIN"
```

Customers cannot access the admin dashboard.

---

# 📁 Project Structure

The project follows the Next.js App Router structure.

```text
guzel-meraki-studio/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── AdminOrdersClient.tsx
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── AdminProductsClient.tsx
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── AdminCategoriesClient.tsx
│   │   │   │
│   │   │   └── enquiries/
│   │   │       ├── page.tsx
│   │   │       └── AdminEnquiriesClient.tsx
│   │   │
│   │   ├── account/
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── logout/
│   │   │   │
│   │   │   ├── orders/
│   │   │   │   └── [id]/
│   │   │   │
│   │   │   └── payments/
│   │   │       └── initiate/
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │
│   ├── context/
│   │   └── CartContext.tsx
│   │
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       └── email.ts
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# 🔄 Application Flow

## Customer Flow

```text
Home Page
    ↓
Browse Products
    ↓
Product Details
    ↓
Add to Cart
    ↓
Cart
    ↓
Checkout
    ↓
Customer Information
    ↓
Create Order
    ↓
Payment
    ↓
Payment Confirmation
    ↓
Order History
```

---

## Admin Flow

```text
Admin Login
    ↓
Admin Dashboard
    ↓
Manage Products
    ↓
Manage Categories
    ↓
Manage Orders
    ↓
Update Order Status
    ↓
Manage Event Enquiries
```

---

# 🧩 Environment Variables

Sensitive credentials are stored inside `.env`.

Example:

```env
DATABASE_URL=your_neon_database_url

JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email
SMTP_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

SAFE_PAY_API_KEY=your_api_key
```

> Never commit your `.env` file to GitHub.

Make sure `.env` is included in `.gitignore`.

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/guzel-meraki-studio.git
```

---

## 2. Enter the project

```bash
cd guzel-meraki-studio
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Configure environment variables

Create a:

```text
.env
```

file in the project root.

Add the required database, authentication, email, image hosting and payment credentials.

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Apply the database schema

```bash
npx prisma db push
```

---

## 7. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Testing

The project can be tested through the following flows:

### Authentication

- Customer registration
- Customer login
- Admin login
- Logout
- Protected routes
- Role-based access

### E-Commerce

- Product browsing
- Product variants
- Cart operations
- Checkout
- Order creation

### Admin

- Dashboard
- Product management
- Category management
- Order management
- Enquiry management

### Payment

- Payment initiation
- Payment status
- Payment attempts
- Order payment status

### Email

- Payment confirmation email
- Customer email delivery

---

# 📱 Responsive Design

The interface is designed using responsive Tailwind CSS layouts.

The application supports:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🎨 Design

The website uses a luxury and elegant visual style suitable for a wedding/event decor and gifting brand.

The primary design palette includes:

```text
Deep Burgundy
Warm Beige
Cream
Gold
Dark Brown
White
```

The UI focuses on:

- Minimalism
- Elegant typography
- Rounded cards
- Spacious layouts
- Responsive components
- Premium visual appearance

---

# 📦 Major Technologies Used

| Technology | Purpose |
|------------|---------|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| Prisma | ORM |
| PostgreSQL | Database |
| Neon | Cloud PostgreSQL hosting |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |
| Cloudinary | Image hosting |
| Safepay | Payment processing |
| Lucide React | UI icons |
| Git | Version control |
| GitHub | Source code hosting |
| VS Code | Development environment |

---

# 📚 Development Concepts Used

This project demonstrates practical implementation of:

- Full-stack web development
- Next.js App Router
- React components
- TypeScript
- REST API development
- CRUD operations
- Authentication
- Authorization
- JWT
- Password hashing
- HTTP-only cookies
- Role-based access control
- Relational database design
- Prisma ORM
- PostgreSQL
- Cloud database
- Shopping cart architecture
- E-commerce checkout
- Payment integration
- Email notifications
- Image hosting
- Admin dashboard
- Responsive UI design
- Environment variables
- Git & GitHub

---

# 🔮 Future Improvements

Potential future improvements include:

- Advanced product search
- Product filtering
- Product reviews and ratings
- Wishlist functionality
- Discount/coupon system
- Advanced analytics dashboard
- Inventory notifications
- Automated payment webhook processing
- Order tracking
- Customer email templates
- Enhanced admin permissions
- Production deployment

---

# 👨‍💻 Developer

Developed as a full-stack web development internship project.

**Guzel Meraki Studio**

Built with:

```text
Next.js
React
TypeScript
Tailwind CSS
Prisma
PostgreSQL
Neon
JWT
Cloudinary
Safepay
Nodemailer
```

---

# 📄 License

This project was developed for educational and internship purposes.
