import { useState } from 'react'

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [buying, setBuying] = useState(false)

  const handleBuy = async () => {
    setBuying(true)
    try {
      const response = await fetch('http://localhost:3002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          buyerPhone: '+260987654321', // In real app, get from user input
          quantity: quantity
        })
      })
      
      if (response.ok) {
        alert('Order placed successfully! Payment will be processed via mobile money.')
      } else {
        alert('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      padding: '1.5rem' 
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{product.name}</h3>
      <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{product.description}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '1rem' }}>K{product.price}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={{ border: '1px solid #d1d5db', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', width: '5rem' }}
        />
      </div>
      
      <button
        onClick={handleBuy}
        disabled={buying}
        style={{ 
          width: '100%', 
          backgroundColor: buying ? '#9ca3af' : '#16a34a', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem', 
          border: 'none',
          cursor: buying ? 'not-allowed' : 'pointer',
          opacity: buying ? 0.5 : 1
        }}
      >
        {buying ? 'Processing...' : `Buy Now - K${product.price * quantity}`}
      </button>
      
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
        Seller: {product.sellerPhone}
      </p>
    </div>
  )
}

export default ProductCard