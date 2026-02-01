// import Image from "next/image";
// import Link from "next/link";

// import heroImg from "../../public/image/hero.png";
// import productImg from "../../public/image/product.png";

// export default function HeroSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-purple-200 via-white to-green-100">
//       <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        
//         {/* LEFT CONTENT */}
//         <div>
//           <span className="inline-block bg-purple-100 text-purple-600 text-sm px-4 py-1 rounded-full mb-6">
//             Create your own
//           </span>

//           <h1 className="text-5xl font-extrabold leading-tight mb-6">
//             Make the most <br />
//             of{" "}
//             <span className="relative inline-block">
//               printing
//               <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-400 rounded-full"></span>
//             </span>
//           </h1>

//           <p className="text-gray-500 max-w-md mb-8">
//             What's more, we do it right! A full administration printing background.
//             Print shirts for yourself or your online business.
//           </p>

//           {/* Buttons */}
//           <div className="flex items-center gap-6 mb-10">
//             <Link 

//               href="/products"
//               className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition"
//             >
//               Shop Now →
//             </Link>

//             <button className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-600 transition">
//               <span className="w-10 h-10 flex items-center justify-center border rounded-full">
//                 ▶
//               </span>
//               How We Work
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="flex gap-12">
//             <div>
//               <p className="text-3xl font-bold">4k+</p>
//               <p className="text-sm text-gray-500">Collections</p>
//             </div>

//             <div>
//               <p className="text-3xl font-bold">9k+</p>
//               <p className="text-sm text-gray-500">
//                 items trusted to deliver
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT IMAGE */}
//         <div className="relative flex justify-center">
//           {/* Background Circle */}
//           <div className="absolute w-[420px] h-[420px] bg-purple-200 rounded-full -z-10"></div>

//           {/* Hero Image */}
//           <Image
//             src={heroImg}
//             alt="Hero"
//             className="w-full max-h-[520px] object-contain"
//             priority
//           />

//           {/* Product Card */}
//           <div className="absolute bottom-20 -left-6 bg-white rounded-xl shadow-lg p-4 w-40">
//             <Image
//               src={productImg}
//               alt="Product"
//               className="rounded-md mb-2"
//             />
//             <p className="text-sm font-medium">Adult Quality Tee</p>
//             <p className="text-green-500 font-semibold">$29.00</p>
//           </div>

//           {/* Badge */}
//           <div className="absolute right-0 top-32 bg-gradient-to-br from-pink-500 to-purple-500 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center text-sm font-semibold shadow-lg">
//             <span>3000+</span>
//             <span className="text-xs font-normal">Products</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import Image from "next/image";
import Link from "next/link";

import heroImg from "../../public/image/hero.png";
import productImg from "../../public/image/product.png";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-rose-100 via-white to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <span className="inline-block bg-rose-100 text-rose-600 text-sm px-4 py-1 rounded-full mb-6">
            New Fashion Collection
          </span>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Discover Your <br />
            <span className="relative inline-block">
              Perfect Style
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-500 rounded-full"></span>
            </span>
          </h1>

          <p className="
           max-w-md mb-8">
            Shop the latest trends in men’s and women’s fashion.
            Premium quality clothes designed for comfort and style.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-6 mb-10">
            <Link
              href="/products"
              className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Shop Collection →
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 text-gray-800 font-medium hover:text-indigo-600 transition"
            >
              <span className="w-10 h-10 flex items-center justify-center border rounded-full">
                ▶
              </span>
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold">12k+</p>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </div>

            <div>
              <p className="text-3xl font-bold">5k+</p>
              <p className="text-sm text-gray-500">
                Fashion Products
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">
          {/* Background Circle */}
          <div className="absolute w-[420px] h-[420px] bg-indigo-200 rounded-full -z-10"></div>

          {/* Hero Image */}
          <Image
            src={heroImg}
            alt="Fashion Model"
            className="w-full max-h-[520px] object-contain"
            priority
          />

          {/* Product Card */}
          <div className="absolute bottom-20 -left-6 bg-white rounded-xl shadow-lg p-4 w-44">
            <Image
              src={productImg}
              alt="Clothing Product"
              className="rounded-md mb-2"
            />
            <p className="text-sm font-medium">Classic Denim Jacket</p>
            <p className="text-indigo-600 font-semibold">$59.00</p>
          </div>

          {/* Badge */}
          <div className="absolute right-0 top-32 bg-gradient-to-br from-indigo-500 to-purple-500 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center text-sm font-semibold shadow-lg">
            <span>50%</span>
            <span className="text-xs font-normal">OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
