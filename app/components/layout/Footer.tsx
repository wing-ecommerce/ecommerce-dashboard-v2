interface FooterProps {
  onCategoryClick?: (category: string) => void;
}

export default function Footer({ onCategoryClick }: FooterProps) {
  const categories = ["Skirt", "T-Shirt", "Jeans", "Dress"];

  return (
    <footer className="bg-gradient-to-b from-green-50 to-white text-gray-700 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* BRAND */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">TeeSpace</h3>
          <p className="text-sm text-gray-600 mb-3">Sustainable fashion crafted for comfort, quality, and style.</p>
          <p className="text-sm">support@greenwear.com</p>
          <p className="text-lg font-semibold mt-2">+1 (800) 456-7890</p>
        </div>

        {/* SHOP CATEGORY LINKS */}
        <div>
          <h4 className="font-semibold text-lg mb-5">Shop</h4>
          <ul className="space-y-3 text-sm">
            {categories.map((category) => (
              <li key={category}>
                <button
                  className="hover:text-green-600 transition"
                  onClick={() => onCategoryClick?.(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Other footer sections */}
        <div>
          <h4 className="font-semibold text-lg mb-5">Customer Care</h4>
          <ul className="space-y-3 text-sm">
            <li>My Account</li>
            <li>Order Tracking</li>
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-5">Company</h4>
          <ul className="space-y-3 text-sm">
            <li>About Us</li>
            <li>Sustainability</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-5">Newsletter</h4>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button className="bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
