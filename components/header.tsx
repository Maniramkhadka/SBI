"use client"

import { useState } from "react"
import Link from "next/link"
import { Apple, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-mobile"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Apple className="h-6 w-6" />
          <span className="font-bold">Dilip Kumar Apple Service</span>
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 flex flex-col gap-4">
                <Link href="#services" onClick={toggleMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  Services
                </Link>
                <Link href="#about" onClick={toggleMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  About
                </Link>
                <Link href="#testimonials" onClick={toggleMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  Testimonials
                </Link>
                <Link href="#contact" onClick={toggleMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  Contact
                </Link>
                <Button asChild>
                  <Link href="/book-repair">Book Repair</Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link href="#services" className="text-sm font-medium hover:underline underline-offset-4">
              Services
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
            <Button asChild>
              <Link href="/book-repair">Book Repair</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
