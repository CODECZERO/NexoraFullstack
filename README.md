# 🛒 Vibe Commerce - Internship Assignment

## 📋 Project Overview
A full-stack shopping cart application built for Vibe Commerce internship screening. This application demonstrates the implementation of core e-commerce functionalities including product listing, cart management, and a mock checkout process.

## 🎯 Assignment Requirements

### Backend API Endpoints

#### 1. Get All Products
- **Method:** `GET`
- **Endpoint:** `/api/products`
- **Description:** Fetches a list of all available products
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Wireless Earbuds",
      "price": 99.99,
      "image": "/images/earbuds.jpg",
      "description": "High-quality wireless earbuds with noise cancellation"
    },
    // ... more products
  ]
  ```

#### 2. Add Item to Cart
- **Method:** `POST`
- **Endpoint:** `/api/cart`
- **Request Body:**
  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Item added to cart",
    "cartItem": {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "name": "Wireless Earbuds",
      "price": 99.99
    }
  }
  ```

#### 3. Get Cart Contents
- **Method:** `GET`
- **Endpoint:** `/api/cart`
- **Response:**
  ```json
  {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "name": "Wireless Earbuds",
        "price": 99.99,
        "quantity": 2,
        "subtotal": 199.98
      }
    ],
    "total": 199.98,
    "totalItems": 2
  }
  ```

#### 4. Remove Item from Cart
- **Method:** `DELETE`
- **Endpoint:** `/api/cart/:id`
- **URL Parameters:**
  - `id`: Cart item ID to remove
- **Success Response (200):**
  ```json
  {
    "message": "Item removed from cart",
    "itemId": 1
  }
  ```

#### 5. Process Checkout
- **Method:** `POST`
- **Endpoint:** `/api/checkout`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "orderId": "ORD-123456",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [
      {
        "name": "Wireless Earbuds",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "total": 199.98,
    "orderDate": "2025-10-29T14:30:00Z"
  }
  ```

### Frontend Features

- **Product Catalog**
  - Display grid of available products
  - Show product details (name, price, image)
  - "Add to Cart" button for each product

- **Shopping Cart**
  - View all items in cart
  - Update item quantities
  - Remove items
  - Display running total

- **Checkout Process**
  - Collect customer information (name, email)
  - Process order
  - Display order confirmation with receipt
  - Fully responsive design for all devices

## 🛠️ Technical Stack

### Frontend
- React 18+
- React Context API (State Management)
- Axios for API requests
- Responsive CSS with Flexbox/Grid

### Backend
- Node.js with Express.js
- MongoDB (Mongoose ODM) / SQLite
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd [project-directory]
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB connection string
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   # Application opens at http://localhost:3000
   ```

## 📚 Project Structure

```
vibe-commerce/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/
        ├── components/   # Reusable UI components
        ├── context/      # Cart context
        ├── pages/        # Application pages
        └── App.js        # Main application component
```

## 📄 API Documentation

### Products
- `GET /api/products`
  - Returns: Array of product objects with id, name, price
  - Example response:
    ```json
    [
      {"id": 1, "name": "Product 1", "price": 29.99},
      {"id": 2, "name": "Product 2", "price": 49.99}
    ]
    ```

### Cart
- `GET /api/cart`
  - Returns: Current cart with items and total
- `POST /api/cart`
  - Body: `{ "productId": 1, "quantity": 2 }`
- `DELETE /api/cart/:id`
  - Removes item from cart by product ID

### Checkout
- `POST /api/checkout`
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`
  - Returns: Order confirmation with receipt

## 📱 Screenshots
*(Add your application screenshots here)*
- Products Page
- Shopping Cart
- Checkout Form
- Order Confirmation

## 🎯 Bonus Features (If Implemented)
- [ ] Database persistence for user sessions
- [ ] Enhanced error handling and form validation
- [ ] Integration with Fake Store API
- [ ] Unit/Integration tests

## 📝 Notes
- This is a mock implementation for internship screening
- No real payments are processed
- Data resets on server restart (unless using persistent DB)

## 📅 Submission
- GitHub Repository: [Your Repo Link]
- Demo Video: [Loom/YouTube Link]
- Submitted on: [Submission Date]
    ├── public/           # Static files
    └── src/              # React source code
        ├── components/   # Reusable UI components
        ├── services/     # API services
        └── App.js        # Main application component
```

## 📚 API Documentation

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process order
- `GET /api/orders` - Get order history

## 📱 Screenshots

| Product Listing | Shopping Cart | Checkout |
|-----------------|---------------|-----------|
| ![Products](/screenshots/products.png) | ![Cart](/screenshots/cart.png) | ![Checkout](/screenshots/checkout.png) |

## 🏆 Future Enhancements

- [ ] User authentication and profiles
- [ ] Product search and filtering
- [ ] Payment gateway integration
- [ ] Order tracking
- [ ] Product reviews and ratings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nexora](https://nexora.io/) for the opportunity
- All open-source libraries and tools used in this project

## ✨ Features

### Core Features
- **Product Catalog**: Display 10 mock products with images, descriptions, and prices
- **Shopping Cart**: Add, remove, and update product quantities
- **Real-time Cart Updates**: Instant feedback on cart modifications
- **Checkout Process**: Customer information form with validation
- **Order Receipt**: Mock receipt generation with order details
- **Responsive Design**: Mobile-first design that works on all devices

### Bonus Features Implemented
- **MongoDB Integration**: Full database persistence for products, cart, and orders
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Toast Notifications**: User-friendly notifications for all actions
- **Loading States**: Smooth loading indicators for better UX
- **Form Validation**: Client-side validation for checkout form
- **Modern UI/UX**: Beautiful gradient design with smooth animations

## 🛠 Tech Stack

### Frontend
- **React 18.2.0**: Modern UI library
- **Axios**: HTTP client for API calls
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **CSS3**: Custom styling with animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 📁 Project Structure

```
Project1/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── seedData.js          # Mock product data
│   ├── models/
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── products.js          # Product routes
│   │   ├── cart.js              # Cart routes
│   │   └── checkout.js          # Checkout routes
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding script
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   ├── CartSidebar.js
│   │   │   ├── CheckoutModal.js
│   │   │   └── CheckoutModal.css
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Project1
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already provided, but verify settings)
# Make sure MongoDB is running on your system
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Step 1: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 2: Seed the Database

```bash
# From the backend directory
cd backend
node scripts/seedDatabase.js
```

You should see: "10 products seeded successfully"

### Step 3: Start the Backend Server

```bash
# From the backend directory
npm start
# or for development with auto-reload
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 4: Start the Frontend Application

```bash
# Open a new terminal and navigate to frontend directory
cd frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Products

**GET /api/products**
- Description: Get all products
- Response: Array of product objects

**GET /api/products/:id**
- Description: Get single product by ID
- Response: Product object

#### Cart

**GET /api/cart**
- Description: Get current cart with items and total
- Response: Cart object with items array and total

**POST /api/cart**
- Description: Add item to cart
- Body: `{ productId: Number, quantity: Number }`
- Response: Updated cart object

**PUT /api/cart/:productId**
- Description: Update item quantity
- Body: `{ quantity: Number }`
- Response: Updated cart object

**DELETE /api/cart/:productId**
- Description: Remove item from cart
- Response: Updated cart object

**DELETE /api/cart**
- Description: Clear entire cart
- Response: Empty cart object

#### Checkout

**POST /api/checkout**
- Description: Process checkout and create order
- Body: 
```json
{
  "customerName": "string",
  "customerEmail": "string",
  "cartItems": [...]
}
```
- Response: Order receipt object

**GET /api/checkout/orders**
- Description: Get all orders (admin/testing)
- Response: Array of order objects

**GET /api/checkout/orders/:orderId**
- Description: Get specific order by ID
- Response: Order object

## 📸 Screenshots

### Home Page - Product Grid
![Product Grid](screenshots/products.png)
*Modern product grid with beautiful cards and hover effects*

### Shopping Cart Sidebar
![Cart Sidebar](screenshots/cart.png)
*Sliding cart sidebar with quantity controls and remove buttons*

### Checkout Modal
![Checkout](screenshots/checkout.png)
*Clean checkout form with order summary*

### Order Receipt
![Receipt](screenshots/receipt.png)
*Success modal with complete order details*

### Mobile Responsive
![Mobile View](screenshots/mobile.png)
*Fully responsive design for mobile devices*

## 🏗 Architecture

### Frontend Architecture
- **Component-Based**: Modular React components for reusability
- **State Management**: React hooks (useState, useEffect)
- **API Layer**: Centralized API service for all backend calls
- **Responsive Design**: Mobile-first CSS with flexbox and grid

### Backend Architecture
- **MVC Pattern**: Separation of models, routes, and controllers
- **RESTful API**: Standard HTTP methods and status codes
- **Database Layer**: Mongoose ODM for MongoDB
- **Error Handling**: Centralized error handling middleware

### Data Flow
1. User interacts with React components
2. Components call API service functions
3. API service makes HTTP requests to Express backend
4. Express routes handle requests and interact with MongoDB
5. Response flows back through the chain
6. React updates UI based on response

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibecommerce
NODE_ENV=development
```

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Product Display**
   - [ ] All 10 products load correctly
   - [ ] Images display properly
   - [ ] Prices and descriptions are visible

2. **Add to Cart**
   - [ ] Click "Add to Cart" on multiple products
   - [ ] Toast notification appears
   - [ ] Cart badge updates with item count

3. **Cart Management**
   - [ ] Open cart sidebar
   - [ ] Increase/decrease quantities
   - [ ] Remove items
   - [ ] Verify total calculation

4. **Checkout Process**
   - [ ] Click "Proceed to Checkout"
   - [ ] Fill in name and email
   - [ ] Submit form
   - [ ] View receipt modal

5. **Responsive Design**
   - [ ] Test on mobile viewport
   - [ ] Test on tablet viewport
   - [ ] Test on desktop viewport

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Product search and filtering
- [ ] Product categories and pagination
- [ ] Wishlist functionality
- [ ] Order history for users
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Admin dashboard for product management
- [ ] Email notifications for orders
- [ ] Inventory management

## 🐛 Known Issues

- None at the moment

## 📝 Notes

- This is a mock e-commerce application for demonstration purposes
- No real payment processing is implemented
- Uses a single mock user ID for cart operations
- Database should be seeded before first use

## 👨‍💻 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd frontend
npm start  # React development server with hot reload
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## 📄 License

This project is created for the Nexora Full Stack Development Internship assignment.

## 🙏 Acknowledgments

- Nexora for the internship opportunity
- Unsplash for product images
- React and Node.js communities

## 📧 Contact

For any questions or clarifications, please contact through the Nexora internship portal.

---

**Assignment Submission Details:**
- **Candidate Name**: [Ankit Sing Mahar]
- **Submission Date**: October 30, 2025
- **GitHub Repository**: [https://github.com/CODECZERO/NexoraFullstack]
- **Demo Video**: [Video URL]

---

Made with ❤️ for Nexora Full Stack Development Internship
# NexoraFullstack
# NexoraFullstack
