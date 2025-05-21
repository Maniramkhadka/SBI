import Link from "next/link"
import { Apple, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Apple className="h-6 w-6" />
              <span className="font-bold">Dilip Kumar Apple Service</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Authorised Apple Service Provider in Butwal, Nepal
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Services</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  iPhone Repairs
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Mac Repairs
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Apple Watch
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Data Recovery
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Company</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#about" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  About Us
                </Link>
                <Link href="#testimonials" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Testimonials
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Warranty
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Privacy Policy
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Contact</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#contact" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Contact Us
                </Link>
                <Link href="tel:+9779857070000" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  +977 9857070000
                </Link>
                <Link
                  href="mailto:info@dilipkumarapple.com.np"
                  className="text-sm text-gray-500 hover:underline dark:text-gray-400"
                >
                  Email Us
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                  Support
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Dilip Kumar Apple Service. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
