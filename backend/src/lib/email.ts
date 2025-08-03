import { Resend } from "resend";
import { extractDateAndTime } from "./date";

const FROM_EMAIL = "noreply@theworksblr.com";

export interface BookingStatusParams {
  to: string;
  name: string;
  itemType: "class" | "event";
  itemName: string;
  status: "confirmed" | "cancelled" | "pending" | string;
  dateTime: string; // ISO string
  resendApiKey: string; // Add API key parameter
}

export interface ReminderParams {
  to: string;
  name: string;
  itemType: "class" | "event";
  itemName: string;
  dateTime: string; // ISO string
}

export interface EnquiryNotificationParams {
  name: string;
  email: string;
  phone?: string;
  message: string;
  to: string; // Who in your org should receive the notification
}

export interface EnquiryAutoReplyParams {
  name: string;
  email: string;
  to?: string; // Optionally override default user email
}

export async function sendBookingStatusEmail({
  to,
  name,
  itemType,
  itemName,
  status,
  dateTime,
  resendApiKey,
}: BookingStatusParams): Promise<void> {
  const resend = new Resend(resendApiKey);
  const { date, time } = extractDateAndTime(dateTime);
  const prettyStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const subject = `Booking ${prettyStatus}: ${itemName}`;
  
  const statusColor = status === "confirmed" ? "#4caf50" : status === "cancelled" ? "#f44336" : "#ff9800";
  const statusIcon = status === "confirmed" ? "✅" : status === "cancelled" ? "❌" : "⏳";
  
  const heading =
    status === "confirmed"
      ? "🎉 Great news! Your booking has been confirmed"
      : status === "cancelled"
        ? "We're sorry to inform you that your booking has been cancelled"
        : `Your booking status has been updated to: ${prettyStatus}`;

  const actionText = status === "confirmed" 
    ? "We're excited to see you at our facility! Please arrive 15 minutes early for check-in."
    : status === "cancelled"
      ? "If you have any questions about this cancellation, please don't hesitate to contact us. We'd be happy to help you reschedule or find an alternative."
      : "We'll keep you updated on any changes to your booking status.";

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Booking ${prettyStatus}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #B15324 0%, #4E291A 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #E3DED3; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">THE WORKS</h1>
            <p style="color: #E3DED3; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">FITNESS & WELLNESS</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 10px;">${statusIcon}</div>
              <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">Hello ${name}!</h2>
            </div>

            <div style="background-color: #f8f9fa; border-left: 4px solid ${statusColor}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #333; margin: 0; font-size: 16px; line-height: 1.6;">${heading}</p>
            </div>

            <!-- Booking Details -->
            <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #B15324; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Booking Details</h3>
              
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 120px; color: #666; font-weight: 500;">${itemType === "class" ? "Class" : "Event"}:</span>
                <span style="color: #333; font-weight: 600;">${itemName}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 120px; color: #666; font-weight: 500;">Date:</span>
                <span style="color: #333; font-weight: 600;">${date}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; width: 120px; color: #666; font-weight: 500;">Time:</span>
                <span style="color: #333; font-weight: 600;">${time}</span>
              </div>
              
              <div style="margin-bottom: 0;">
                <span style="display: inline-block; width: 120px; color: #666; font-weight: 500;">Status:</span>
                <span style="color: ${statusColor}; font-weight: 700; text-transform: uppercase; font-size: 14px;">${prettyStatus}</span>
              </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #333; margin: 0; font-size: 15px; line-height: 1.6;">${actionText}</p>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Need help? We're here for you!</p>
              <p style="color: #B15324; margin: 0; font-size: 14px; font-weight: 500;">Reply to this email or contact us directly</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #4E291A; padding: 25px 30px; text-align: center;">
            <p style="color: #E3DED3; margin: 0; font-size: 14px; opacity: 0.9;">
              Thank you for choosing The Works<br>
              <span style="font-size: 12px; opacity: 0.7;">Your fitness journey is our priority</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendReminderEmail({
  to,
  name,
  itemType,
  itemName,
  dateTime,
}: ReminderParams): Promise<void> {
  const { date, time } = extractDateAndTime(dateTime);
  const subject = `Reminder: Your upcoming ${itemType === "class" ? "Class" : "Event"}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <h2>Hi ${name},</h2>
      <p>This is a reminder for your upcoming <strong>${itemType}</strong>:</p>
      <ul>
        <li>
          <strong>${itemType === "class" ? "Class" : "Event"}:</strong> ${itemName}
        </li>
        <li>
          <strong>Date:</strong> ${date}
        </li>
        <li>
          <strong>Time:</strong> ${time}
        </li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  });
}

export async function sendEnquiryNotificationEmail({
  name,
  email: userEmail,
  phone,
  message,
  to,
}: EnquiryNotificationParams): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL, // e.g. yourname@gmail.com or info@yourdomain.com
    to,
    subject: `New Enquiry from ${name}`,
    html: `
      <h2>New Enquiry Received</h2>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ""}
      </ul>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
}

export async function sendEnquiryAutoReplyEmail({
  name,
  email,
  to,
}: EnquiryAutoReplyParams): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL, // Show you as the sender
    to: to || email,
    subject: "Thanks for contacting us!",
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out.</p>
      <p>We've received your enquiry and our team will get back to you soon.</p>
      <p>— Theworksblr Team</p>
    `,
  });
}
