# Kalungu Clothing Brand Ecommerce Platform

A modern, full-stack ecommerce platform built with Laravel (backend) and React (frontend) for a clothing brand. This project provides a complete solution for online clothing retail with features like product management, user authentication, shopping cart, order processing, and more.

## 🚀 Features

### Backend (Laravel API)
- **Authentication System**: JWT-based authentication with Laravel Sanctum
- **Product Management**: Full CRUD operations for products, categories, and variants
- **User Management**: Customer and admin user roles with different permissions
- **Shopping Cart**: Persistent cart functionality with session management
- **Wishlist**: Save products for later purchase
- **Order Processing**: Complete order lifecycle from cart to delivery
- **Review System**: Product reviews and ratings with moderation
- **Address Management**: Multiple shipping and billing addresses
- **Admin Panel**: Administrative interface for managing the platform

### Frontend (React)
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Login, registration, and password management
- **Product Catalog**: Browse products with filtering and search
- **Shopping Experience**: Add to cart, wishlist, and checkout flow
- **User Dashboard**: Profile management and order history
- **Responsive Design**: Mobile-first approach for all devices

## 🛠️ Technology Stack

### Backend
- **Laravel 12.x**: PHP framework
- **Laravel Sanctum**: API authentication
- **MySQL**: Database
- **Laravel Breeze**: Authentication scaffolding

### Frontend
- **React 19**: JavaScript library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Axios**: HTTP client

## 📁 Project Structure

```
kalungusite/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/           # API controllers
│   ├── Models/                # Eloquent models
│   └── Providers/             # Service providers
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── routes/
│   └── api.php               # API routes
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- MySQL 8.0 or higher

### Backend Setup

1. **Install PHP dependencies**:
   ```bash
   composer install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database configuration**:
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=kalungu_ecommerce
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Run migrations and seeders**:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Start the Laravel server**:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment configuration**:
   Update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - List products (with filters)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders/{id}/cancel` - Cancel order

### Wishlist Endpoints
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add/{product}` - Add to wishlist
- `DELETE /api/wishlist/remove/{product}` - Remove from wishlist

## 🎨 Frontend Features

### Pages
- **Home**: Featured products and hero section
- **Products**: Product catalog with filtering
- **Product Detail**: Individual product view
- **Cart**: Shopping cart management
- **Checkout**: Order completion
- **Login/Register**: Authentication
- **Profile**: User account management
- **Orders**: Order history and tracking

### Components
- **Header**: Navigation and search
- **Footer**: Links and company info
- **ProductCard**: Product display component
- **Layout**: Main layout wrapper
- **ProtectedRoute**: Authentication guard

## 🔧 Configuration

### Laravel Configuration
- CORS settings in `config/cors.php`
- Sanctum configuration in `config/sanctum.php`
- Database configuration in `config/database.php`

### React Configuration
- API base URL in `frontend/.env`
- Tailwind CSS configuration in `frontend/tailwind.config.js`
- Vite configuration in `frontend/vite.config.ts`

## 🧪 Testing

### Backend Testing
```bash
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up production environment variables
2. Run `composer install --optimize-autoloader --no-dev`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Run `php artisan view:cache`

### Frontend Deployment
1. Run `npm run build`
2. Deploy the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@kalungu.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0**: Initial release with basic ecommerce functionality
- **v1.1.0**: Added wishlist and review features
- **v1.2.0**: Enhanced UI/UX and mobile responsiveness

---

Built with ❤️ for Kalungu Clothing Brand