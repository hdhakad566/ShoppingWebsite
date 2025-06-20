import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">🏠 Home</Link>
        <Link to="/cart">🛒 Cart</Link>
        <Link to="/order-history">📋 Order History</Link>
      </nav>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
