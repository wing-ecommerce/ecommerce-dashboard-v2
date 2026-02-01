import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
  colors: string[];
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (slug: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.slug);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-2 mb-4">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition ${
            product.inStock
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}