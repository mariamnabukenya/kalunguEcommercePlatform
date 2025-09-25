# Kalungu Clothing - React Frontend

A modern, responsive React frontend for the Kalungu Clothing ecommerce platform. Built with TypeScript, Tailwind CSS, and React Query for optimal performance and user experience.

## Features

### 🛍️ Ecommerce Functionality
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries and reviews
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Wishlist**: Save favorite products for later
- **Checkout**: Complete order process with address and payment forms
- **Order Management**: View order history and track order status

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure authentication with form validation
- **Profile Management**: Update user information and preferences
- **Protected Routes**: Secure access to user-specific features
- **Social Login**: Google and Facebook authentication options

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capability
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: WCAG compliant components and navigation

### ⚡ Performance & Optimization
- **React Query**: Efficient data fetching and caching
- **Code Splitting**: Lazy loading for optimal bundle size
- **Image Optimization**: Responsive images with lazy loading
- **SEO Ready**: Meta tags and structured data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Context API, React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Laravel backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kalungu-clothing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── lib/               # Utility functions and API service
│   ├── api.ts
│   └── utils.ts
├── pages/             # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── Orders.tsx
│   ├── OrderDetail.tsx
│   ├── Wishlist.tsx
│   └── NotFound.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## API Integration

The frontend communicates with the Laravel backend API through the `apiService` in `src/lib/api.ts`. All API endpoints are configured to work with the Laravel Sanctum authentication system.

### Key API Features:
- **Authentication**: Login, register, logout with token management
- **Products**: CRUD operations, search, filtering, featured products
- **Cart**: Add/remove items, quantity updates, cart persistence
- **Wishlist**: Add/remove items, move to cart functionality
- **Orders**: Create orders, view order history, order tracking
- **Reviews**: Product reviews and ratings
- **User Management**: Profile updates, address management

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Kalungu Clothing
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette (primary, secondary)
- Extended animations and keyframes
- Custom utility classes for buttons, inputs, and cards

## Features in Detail

### Product Catalog
- **Advanced Filtering**: Category, brand, price range, availability
- **Search**: Real-time product search with debouncing
- **Sorting**: Multiple sort options (price, name, rating, date)
- **Pagination**: Efficient data loading with pagination
- **Responsive Grid**: Adaptive layout for different screen sizes

### Shopping Experience
- **Cart Management**: Persistent cart across sessions
- **Wishlist**: Save products for later purchase
- **Quick Actions**: Add to cart, wishlist from product cards
- **Stock Management**: Real-time stock status and availability

### User Experience
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error handling with user feedback
- **Form Validation**: Real-time validation with helpful messages
- **Accessibility**: Keyboard navigation and screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@kalungu.com or create an issue in the repository.