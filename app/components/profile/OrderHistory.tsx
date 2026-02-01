"use client";

import Image from "next/image";

type OrderItem = {
  id: number;
  productName: string;
  productColor: string;
  productImg: string;
  price: number;
  qty: number;
  deliveryDate: string;
};

const orders: OrderItem[] = [
  {
    id: 1,
    productName: "Apple Airpods Pro",
    productColor: "White",
    productImg: "https://pagedone.io/asset/uploads/1705474950.png",
    price: 249.99,
    qty: 2,
    deliveryDate: "23rd March 2021",
  },
  {
    id: 2,
    productName: "Apple Airpods Pro",
    productColor: "White",
    productImg: "https://pagedone.io/asset/uploads/1705474950.png",
    price: 249.99,
    qty: 2,
    deliveryDate: "23rd March 2021",
  },
  {
    id: 3,
    productName: "Apple Airpods Pro",
    productColor: "White",
    productImg: "https://pagedone.io/asset/uploads/1705474950.png",
    price: 249.99,
    qty: 2,
    deliveryDate: "23rd March 2021",
  },
];

export default function MyOrders() {
  return (
    <section className=" bg-white">
      <div className="w-full mx-auto">
        <div className="main-data p-8 sm:p-14 bg-gray-50 rounded-3xl">
          <h2 className="text-center font-manrope font-semibold text-4xl text-black mb-16">
            Order History
          </h2>

          {/* Header */}
          <div className="grid grid-cols-8 pb-9 font-medium text-lg text-gray-600">
            <div className="col-span-8 lg:col-span-4 text-indigo-600">
              Product
            </div>
            <div className="col-span-1 max-lg:hidden text-center">Price</div>
            <div className="col-span-1 max-lg:hidden text-center">Qty</div>
            <div className="col-span-2 max-lg:hidden text-center">
              Delivery Expected by
            </div>
          </div>

          {/* Orders List */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="box p-8 rounded-3xl bg-gray-100 grid grid-cols-8 mb-7 cursor-pointer transition-all duration-500 hover:bg-indigo-50 max-lg:max-w-xl max-lg:mx-auto"
            >
              {/* Image */}
              <div className="col-span-8 sm:col-span-4 lg:col-span-1 sm:row-span-4 lg:row-span-1">
                <Image
                  src={order.productImg}
                  alt={order.productName}
                  width={120}
                  height={120}
                  className="max-lg:w-auto max-sm:mx-auto rounded-xl object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="col-span-8 sm:col-span-4 lg:col-span-3 flex h-full justify-center pl-4 flex-col max-lg:items-center">
                <h5 className="font-manrope font-semibold text-2xl leading-9 text-black mb-1 whitespace-nowrap">
                  {order.productName}
                </h5>
                <p className="font-normal text-base leading-7 text-gray-600 max-md:text-center">
                  {order.productColor}
                </p>
              </div>

              {/* Price */}
              <div className="col-span-8 sm:col-span-4 lg:col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl leading-8 text-black">
                  ${order.price}
                </p>
              </div>

              {/* Quantity */}
              <div className="col-span-8 sm:col-span-4 lg:col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl leading-8 text-indigo-600 text-center">
                  {order.qty}
                </p>
              </div>

              {/* Delivery Date */}
              <div className="col-span-8 sm:col-span-4 lg:col-span-2 flex items-center justify-center">
                <p className="font-semibold text-xl leading-8 text-black">
                  {order.deliveryDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
