import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Veranda Plastics</h3>
            <p className="text-gray-400">
              Premium outdoor furniture for hotels and resorts since 2010.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/?category=chairs" className="hover:text-white">
                  Outdoor Chairs
                </Link>
              </li>
              <li>
                <Link href="/?category=tables" className="hover:text-white">
                  Tables
                </Link>
              </li>
              <li>
                <Link href="/?category=planters" className="hover:text-white">
                  Planters
                </Link>
              </li>
              <li>
                <Link href="/?category=bins" className="hover:text-white">
                  Waste Bins
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#sustainability" className="hover:text-white">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@verandaplastics.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Industrial Park Dr</li>
              <li>Manufacturing City, ST 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Veranda Plastics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
