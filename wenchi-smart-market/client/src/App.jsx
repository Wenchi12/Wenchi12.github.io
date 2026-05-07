import { useState, useEffect } from 'react'
import ProductList from './components/ProductList'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="bg-green-600 text-white p-4">
        <h1 className="text-2xl font-bold">Wenchi Smart Market</h1>
        <p className="text-sm">Fresh produce from local farmers</p>
      </header>
      
      <main className="container mx-auto p-4">
        <ProductList />
      </main>
    </div>
  )
}

export default App