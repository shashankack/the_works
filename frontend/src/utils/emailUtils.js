// Email integration utilities for frontend

export const createEmailLink = (to, subject, body) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
};

export const emailTemplates = {
  enquiryReply: (name) => ({
    subject: "Re: Your enquiry at The Works",
    body: `Hi ${name},

Thank you for contacting The Works! 

I've received your enquiry and would love to help you with your fitness journey. 

Let me know if you'd like to:
• Schedule a consultation call
• Book a trial session
• Learn more about our programs

What would work best for you?

Best regards,
The Works Team

📍 Mount Blue, Bangalore
📞 +91 98765 43210
🌐 www.theworks.fitness`
  }),

  bookingConfirmation: (name, bookingDetails) => ({
    subject: `Booking Confirmation - ${bookingDetails.itemName}`,
    body: `Hi ${name},

Your booking has been confirmed! 🎉

Details:
• ${bookingDetails.itemType}: ${bookingDetails.itemName}
• Date: ${bookingDetails.date}
• Time: ${bookingDetails.time}

What to bring:
• Comfortable workout clothes
• Water bottle
• Towel
• Positive energy! 💪

See you soon!

The Works Team`
  }),

  reminderEmail: (name, bookingDetails) => ({
    subject: `Reminder: Your ${bookingDetails.itemType} tomorrow`,
    body: `Hi ${name},

Just a friendly reminder about your upcoming ${bookingDetails.itemType}:

• ${bookingDetails.itemName}
• Tomorrow at ${bookingDetails.time}
• Location: Mount Blue, Bangalore

We're excited to see you!

The Works Team`
  })
};

export const sendQuickEmail = (type, recipientData, bookingData = null) => {
  const template = emailTemplates[type];
  if (!template) return;

  const emailData = template(recipientData.name, bookingData);
  const emailLink = createEmailLink(
    recipientData.email,
    emailData.subject,
    emailData.body
  );
  
  window.open(emailLink, '_blank');
};
