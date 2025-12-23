import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { router } from './router'

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
