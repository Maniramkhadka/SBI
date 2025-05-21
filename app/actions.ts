"use server"

import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  deviceType: string
  deviceModel: string
  issueDescription: string
  preferredDate: string
  preferredTime: string
}

// Function to send email notification
async function sendEmailNotification(booking: BookingFormData) {
  try {
    const adminEmail = "dilipkr273305@gmail.com"
    const subject = `New Repair Booking: ${booking.deviceType} - ${booking.deviceModel}`

    // Create HTML content for better formatting
    const htmlContent = `
      <h2>New Repair Booking Details</h2>
      
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      
      <h3>Device Information</h3>
      <p><strong>Type:</strong> ${booking.deviceType}</p>
      <p><strong>Model:</strong> ${booking.deviceModel}</p>
      <p><strong>Issue:</strong> ${booking.issueDescription}</p>
      
      <h3>Appointment Details</h3>
      <p><strong>Date:</strong> ${booking.preferredDate}</p>
      <p><strong>Time:</strong> ${booking.preferredTime}</p>
      
      <p>Please contact the customer to confirm this appointment.</p>
    `

    // Plain text version as fallback
    const textContent = `
      New Repair Booking Details:
      
      Customer: ${booking.firstName} ${booking.lastName}
      Email: ${booking.email}
      Phone: ${booking.phone}
      
      Device: ${booking.deviceType} - ${booking.deviceModel}
      Issue: ${booking.issueDescription}
      
      Appointment: ${booking.preferredDate} at ${booking.preferredTime}
      
      Please contact the customer to confirm this appointment.
    `

    // Create a transporter using the environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // Common service - adjust based on your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: `"Apple Repair Center" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    console.log("Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send email notification:", error)
    return false
  }
}

// Function to send confirmation email to customer
async function sendCustomerConfirmation(booking: BookingFormData) {
  try {
    const subject = `Your Apple Repair Booking Confirmation`

    // Create HTML content for better formatting
    const htmlContent = `
      <h2>Your Repair Booking is Confirmed!</h2>
      
      <p>Dear ${booking.firstName} ${booking.lastName},</p>
      
      <p>Thank you for booking a repair with Dilip Kumar Apple Service. We have received your booking request with the following details:</p>
      
      <h3>Device Information</h3>
      <p><strong>Type:</strong> ${booking.deviceType}</p>
      <p><strong>Model:</strong> ${booking.deviceModel}</p>
      <p><strong>Issue:</strong> ${booking.issueDescription}</p>
      
      <h3>Appointment Details</h3>
      <p><strong>Date:</strong> ${booking.preferredDate}</p>
      <p><strong>Time:</strong> ${booking.preferredTime}</p>
      
      <p>Our technician will review your booking and contact you shortly to confirm your appointment. If you need to make any changes to your booking, please contact us at:</p>
      
      <p>Phone: +977 9857070000<br>
      Email: info@dilipkumarapple.com.np</p>
      
      <p>Thank you for choosing Dilip Kumar Apple Service!</p>
      
      <p>Best regards,<br>
      Dilip Kumar<br>
      Apple Certified Technician</p>
    `

    // Plain text version as fallback
    const textContent = `
      Your Repair Booking is Confirmed!
      
      Dear ${booking.firstName} ${booking.lastName},
      
      Thank you for booking a repair with Dilip Kumar Apple Service. We have received your booking request with the following details:
      
      Device Information:
      Type: ${booking.deviceType}
      Model: ${booking.deviceModel}
      Issue: ${booking.issueDescription}
      
      Appointment Details:
      Date: ${booking.preferredDate}
      Time: ${booking.preferredTime}
      
      Our technician will review your booking and contact you shortly to confirm your appointment. If you need to make any changes to your booking, please contact us at:
      
      Phone: +977 9857070000
      Email: info@dilipkumarapple.com.np
      
      Thank you for choosing Dilip Kumar Apple Service!
      
      Best regards,
      Dilip Kumar
      Apple Certified Technician
    `

    // Create a transporter using the environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // Common service - adjust based on your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: `"Dilip Kumar Apple Service" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    console.log("Customer confirmation email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error)
    return false
  }
}

export async function bookRepair(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate a delay for processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Extract form data
    const booking: BookingFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      deviceType: formData.get("deviceType") as string,
      deviceModel: formData.get("deviceModel") as string,
      issueDescription: formData.get("issueDescription") as string,
      preferredDate: formData.get("preferredDate") as string,
      preferredTime: formData.get("preferredTime") as string,
    }

    // Validate form data
    if (!booking.firstName || !booking.lastName || !booking.email || !booking.phone || !booking.deviceType) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // In a real application, you would save this data to a database
    console.log("Booking received:", booking)

    // Send email notifications
    const adminNotified = await sendEmailNotification(booking)
    const customerNotified = await sendCustomerConfirmation(booking)

    // Log notification status
    console.log("Admin notification sent:", adminNotified)
    console.log("Customer notification sent:", customerNotified)

    // Revalidate the page to show updated data
    revalidatePath("/")

    return {
      success: true,
      message:
        "Your repair booking has been successfully submitted. We've sent you a confirmation email with your booking details.",
    }
  } catch (error) {
    console.error("Error booking repair:", error)
    return {
      success: false,
      message: "There was an error submitting your booking. Please try again or contact us directly.",
    }
  }
}
