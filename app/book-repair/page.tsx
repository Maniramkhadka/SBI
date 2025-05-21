import { BookingForm } from "@/components/booking-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Book a Repair | Dilip Kumar Apple Service",
  description: "Schedule a repair appointment for your Apple device with our certified technician in Butwal, Nepal.",
}

export default function BookRepairPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Book a Repair</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Schedule a repair appointment with our Apple certified technician, Dilip Kumar.
              </p>
            </div>
            <BookingForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
