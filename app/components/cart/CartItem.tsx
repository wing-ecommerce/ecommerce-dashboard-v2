'use client';

import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onUpdateQuantity: (id: number, change: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-green-600 font-bold mt-1">
          ${item.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;