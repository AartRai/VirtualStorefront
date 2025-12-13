import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
