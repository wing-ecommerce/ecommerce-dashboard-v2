import Image from "next/image";
import Link from "next/link";

import IdeaImg from "../../public/image/idea.png";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-white to-purple-50 -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT – Illustration */}
        <div className="relative flex justify-center">
          <div className="absolute -left-10 -top-10 w-72 h-72 bg-purple-100 rounded-3xl -z-10" />
          
          <Image
            src={IdeaImg}
            alt="Design preview"
            className="rounded-2xl shadow-xl"
          />
        </div>

        {/* RIGHT – Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            Free and easy way to <br />
            bring your ideas to life
          </h2>

          <p className="text-gray-500 max-w-md mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Quisque convallis consequat.
          </p>

          <Link 
            href="/products"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}