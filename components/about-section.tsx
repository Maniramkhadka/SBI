import Image from "next/image"
import { Award, CheckCircle } from "lucide-react"

export function AboutSection() {
  const certifications = [
    "Apple Certified Mac Technician (ACMT)",
    "Apple Certified iOS Technician (ACiT)",
    "Apple Certified Associate (ACA)",
    "10+ years of Apple repair experience",
    "Genuine Apple parts provider",
  ]

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                <Award className="mr-1 h-4 w-4 inline-block" />
                Certified Expert
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Dilip Kumar</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                With over a decade of experience in Apple device repairs, Dilip Kumar is Butwal's most trusted Apple
                technician.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-500 dark:text-gray-400">
                As an Authorised Apple Service Provider, our center offers the highest quality repairs using genuine
                Apple parts. Dilip Kumar has personally repaired thousands of Apple devices and maintains the highest
                standards of service.
              </p>
              <ul className="grid gap-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Dilip Kumar working on Apple devices"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
