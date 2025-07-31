import { Resend } from "resend";
import { extractDateAndTime } from "./date";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.FROM_EMAIL || "yourname@gmail.com";

export interface BookingStatusParams {
  to: string;
  name: string;
  itemType: "class" | "event";
  itemName: string;
  status: "confirmed" | "cancelled" | "pending" | string;
  dateTime: string; // ISO string
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
}: BookingStatusParams): Promise<void> {
  const { date, time } = extractDateAndTime(dateTime);
  const prettyStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const subject = `Your ${itemType === "class" ? "Class" : "Event"} Booking: ${prettyStatus}`;
  const heading =
    status === "confirmed"
      ? "Congratulations, your booking is confirmed!"
      : status === "cancelled"
        ? "We're sorry, your booking was cancelled."
        : `Booking status: ${prettyStatus}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <h2>Hello ${name},</h2>
      <p>${heading}</p>
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
        <li>
          <strong>Status:</strong> ${prettyStatus}
        </li>
      </ul>
      <p>If you have questions, please reply to this email.</p>
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
