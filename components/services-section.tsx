import { Laptop, Smartphone, Watch, Headphones, PenToolIcon as Tool, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ServicesSection() {
  const services = [
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "iPhone Repairs",
      description: "Screen replacements, battery replacements, camera repairs, and more for all iPhone models.",
    },
    {
      icon: <Laptop className="h-10 w-10 text-primary" />,
      title: "Mac Repairs",
      description: "Hardware diagnostics, component replacements, and software troubleshooting for MacBooks and iMacs.",
    },
    {
      icon: <Watch className="h-10 w-10 text-primary" />,
      title: "Apple Watch Services",
      description: "Screen repairs, battery replacements, and diagnostics for all Apple Watch generations.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-primary" />,
      title: "AirPods & Accessories",
      description: "Cleaning, repairs, and replacements for AirPods and other Apple accessories.",
    },
    {
      icon: <Tool className="h-10 w-10 text-primary" />,
      title: "Data Recovery",
      description: "Professional data recovery services for all Apple devices with damaged storage.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Express Repairs",
      description: "Quick turnaround repairs for common issues, often completed within the same day.",
    },
  ]

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              <Shield className="mr-1 h-4 w-4 inline-block" />
              Authorised Service
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Apple Repair Services</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We offer a comprehensive range of repair services for all Apple devices with genuine parts and expert
              technicians.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
