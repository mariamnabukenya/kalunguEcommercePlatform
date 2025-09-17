# KalunguBrand Ecommerce Website

A modern full-stack ecommerce application built with Laravel (backend API) and React (frontend) for a clothing brand.

## 🚀 Features

### Backend (Laravel API)
- **Authentication & Authorization**: User registration, login with Laravel Sanctum
- **Product Management**: Complete product catalog with categories, variants, and images
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Complete checkout process, order history
- **Wishlist**: Save favorite products
- **Reviews & Ratings**: Product reviews and ratings system
- **Admin Panel**: Admin dashboard for managing products, orders, and users
- **RESTful API**: Comprehensive API endpoints for all functionality

### Frontend (React)
- **Modern React**: Built with React 18, TypeScript, and Vite
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Context API and TanStack Query for server state
- **Authentication**: Secure login/register with JWT tokens
- **Product Catalog**: Advanced filtering, search, and pagination
- **Shopping Experience**: Smooth cart management and checkout flow
- **User Dashboard**: Profile management, order history, wishlist

## 🛠 Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **Laravel Sanctum** - API authentication
- **SQLite/MySQL** - Database
- **Eloquent ORM** - Database interactions

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Heroicons** - Icons

## 📦 Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm/yarn

### Backend Setup

1. **Clone and install dependencies**
   ```bash
   cd kalungusite
   composer install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   # For SQLite (default)
   touch database/database.sqlite
   
   # Or configure MySQL in .env file
   # DB_CONNECTION=mysql
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=kalungusite
   # DB_USERNAME=root
   # DB_PASSWORD=
   ```

4. **Run Migrations and Seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Start Laravel Server**
   ```bash
   php artisan serve
   # Server will run on http://localhost:8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL if needed (default: http://localhost:8000/api)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Server will run on http://localhost:5173
   ```

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout (requires auth)
GET  /api/auth/profile      # Get user profile (requires auth)
PUT  /api/auth/profile      # Update user profile (requires auth)
```

### Products
```
GET  /api/products          # Get products with filtering
GET  /api/products/featured # Get featured products
GET  /api/products/search   # Search products
GET  /api/products/{id}     # Get single product
```

### Categories
```
GET  /api/categories        # Get all categories
GET  /api/categories/{slug} # Get category with products
```

### Cart (Authentication Required)
```
GET    /api/cart           # Get cart items
POST   /api/cart/add       # Add item to cart
PUT    /api/cart/{id}      # Update cart item
DELETE /api/cart/{id}      # Remove cart item
```

### Orders (Authentication Required)
```
GET  /api/orders           # Get user orders
POST /api/orders           # Create new order
GET  /api/orders/{id}      # Get single order
```

### Wishlist (Authentication Required)
```
GET    /api/wishlist                    # Get wishlist items
POST   /api/wishlist/add/{productId}    # Add to wishlist
DELETE /api/wishlist/remove/{productId} # Remove from wishlist
```

## 👥 User Accounts

### Default Test Accounts
```
Super Admin:
- Email: superadmin@example.com
- Password: password123

Admin:
- Email: admin@example.com
- Password: password123

Customer:
- Email: customer@example.com
- Password: password123
```

## 📱 Frontend Routes

```
/                    # Homepage
/products            # Product catalog
/products/:id        # Product details
/cart               # Shopping cart
/checkout           # Checkout (auth required)
/login              # Login page
/register           # Registration page
/profile            # User profile (auth required)
/orders             # Order history (auth required)
/wishlist           # Wishlist (auth required)
```

## 🎨 Customization

### Styling
- Modify `frontend/src/index.css` for global styles
- Update `frontend/tailwind.config.js` for theme customization
- Colors and branding can be changed in the Tailwind config

### API Configuration
- Backend API routes are defined in `routes/api.php`
- Frontend API client is in `frontend/src/services/api.ts`
- Environment variables control API URLs and settings

## 🚀 Deployment

### Backend (Laravel)
1. Configure production environment variables
2. Set up database and run migrations
3. Configure web server (Apache/Nginx)
4. Set appropriate file permissions

### Frontend (React)
1. Build for production: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure environment variables for production API

## 🔐 Security Features

- **CSRF Protection**: Laravel CSRF tokens
- **API Authentication**: Laravel Sanctum tokens
- **Password Hashing**: Bcrypt password hashing
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Eloquent ORM protection

## 🧪 Testing

### Backend Testing
```bash
# Run PHP tests
php artisan test
```

### Frontend Testing
```bash
# Run frontend tests (when implemented)
npm run test
```

## 📈 Performance Optimizations

- **Database Indexing**: Proper indexes on frequently queried columns
- **Query Optimization**: Efficient Eloquent queries with eager loading
- **Caching**: API response caching and query optimization
- **Image Optimization**: Responsive images and lazy loading
- **Code Splitting**: React lazy loading for optimal bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**KalunguBrand** - Premium clothing for the modern individual. 🛍️