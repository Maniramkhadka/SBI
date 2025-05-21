"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { bookRepair } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

const deviceTypes = [
  { value: "iphone", label: "iPhone" },
  { value: "ipad", label: "iPad" },
  { value: "macbook", label: "MacBook" },
  { value: "imac", label: "iMac" },
  { value: "apple-watch", label: "Apple Watch" },
  { value: "airpods", label: "AirPods" },
  { value: "other", label: "Other" },
]

const timeSlots = [
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
]

export function BookingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<{
    status: "idle" | "success" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })
  const [formData, setFormData] = useState({
    deviceType: "",
    preferredTime: "",
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormState({ status: "idle", message: "" })

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

      // Add the select values that aren't automatically included in FormData
      formData.set("deviceType", formData.get("deviceType") || "")
      formData.set("preferredTime", formData.get("preferredTime") || "")

      const result = await bookRepair(formData)

      if (result.success) {
        setFormState({
          status: "success",
          message: result.message,
        })
        form.reset()
        setFormData({ deviceType: "", preferredTime: "" })
        // Scroll to the top of the form to show the success message
        window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" })
      } else {
        setFormState({
          status: "error",
          message: result.message,
        })
      }
    } catch (error) {
      setFormState({
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
      router.refresh()
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Get tomorrow's date as the minimum date for booking
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book a Repair</CardTitle>
        <CardDescription>
          Fill out the form below to schedule a repair appointment with our Apple certified technician.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formState.status === "success" && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        {formState.status === "error" && (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deviceType">Device Type *</Label>
              <Select
                name="deviceType"
                value={formData.deviceType}
                onValueChange={(value) => handleSelectChange("deviceType", value)}
                required
              >
                <SelectTrigger id="deviceType">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceModel">Device Model *</Label>
              <Input id="deviceModel" name="deviceModel" placeholder="e.g. iPhone 13 Pro, MacBook Air M1" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription">Describe the Issue *</Label>
            <Textarea
              id="issueDescription"
              name="issueDescription"
              placeholder="Please describe the problem with your device in detail"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input id="preferredDate" name="preferredDate" type="date" min={minDate} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time *</Label>
              <Select
                name="preferredTime"
                value={formData.preferredTime}
                onValueChange={(value) => handleSelectChange("preferredTime", value)}
                required
              >
                <SelectTrigger id="preferredTime">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <input type="hidden" name="deviceType" value={formData.deviceType} />
          <input type="hidden" name="preferredTime" value={formData.preferredTime} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Book Repair Appointment"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
        <div className="flex justify-between w-full">
          <p>* Required fields</p>
          <p>We'll confirm your appointment within 2 hours</p>
        </div>
        <p className="text-center text-xs">You'll receive a confirmation email after submitting this form</p>
      </CardFooter>
    </Card>
  )
}
