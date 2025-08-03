// Professional email templates for The Works

export const getEmailHeader = () => `
  <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="background: linear-gradient(135deg, #B15324 0%, #4E2916 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #E3DED3; margin: 0; font-size: 28px; font-weight: bold;">The Works</h1>
      <p style="color: #E3DED3; margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Build What Moves You</p>
    </div>
`;

export const getEmailFooter = () => `
    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 3px solid #B15324;">
      <p style="color: #666; margin: 0 0 15px; font-size: 14px;">
        <strong>The Works Fitness Studio</strong><br>
        📍 Mount Blue, Bangalore<br>
        📞 +91 98765 43210 | ✉️ hello@theworks.fitness
      </p>
      <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
        <p style="color: #999; margin: 0; font-size: 12px;">
          © 2025 The Works. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

export const getBookingConfirmationTemplate = (params: {
  name: string;
  itemType: "class" | "event";
  itemName: string;
  dateTime: string;
  status: string;
}) => {
  const { name, itemType, itemName, dateTime, status } = params;
  const isConfirmed = status === "confirmed";
  const statusColor = isConfirmed ? "#28a745" : "#dc3545";
  const statusText = isConfirmed ? "Confirmed" : "Cancelled";
  const emoji = isConfirmed ? "🎉" : "😔";
  
  return `
    ${getEmailHeader()}
    <div style="background: white; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #B15324; margin: 0 0 10px; font-size: 24px;">
          ${emoji} Booking ${statusText}
        </h2>
        <div style="background: ${statusColor}; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; font-weight: bold;">
          ${statusText.toUpperCase()}
        </div>
      </div>
      
      <p style="color: #333; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
        Hi <strong>${name}</strong>,
      </p>
      
      <p style="color: #333; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
        ${isConfirmed 
          ? `Great news! Your ${itemType} booking has been confirmed. We're excited to see you!`
          : `We regret to inform you that your ${itemType} booking has been cancelled. We apologize for any inconvenience.`
        }
      </p>
      
      <div style="background: #f8f9fa; border-left: 4px solid #B15324; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #B15324; margin: 0 0 15px; font-size: 18px;">Booking Details</h3>
        <p style="color: #333; margin: 5px 0; font-size: 16px;"><strong>${itemType === "class" ? "Class" : "Event"}:</strong> ${itemName}</p>
        <p style="color: #333; margin: 5px 0; font-size: 16px;"><strong>Date & Time:</strong> ${dateTime}</p>
        <p style="color: #333; margin: 5px 0; font-size: 16px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
      </div>
      
      ${isConfirmed ? `
        <div style="background: #e8f5e8; border: 1px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #28a745; margin: 0 0 10px;">What to bring:</h4>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Comfortable workout clothes</li>
            <li>Water bottle</li>
            <li>Towel</li>
            <li>Positive energy! 💪</li>
          </ul>
        </div>
      ` : `
        <div style="background: #ffeaea; border: 1px solid #dc3545; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="color: #dc3545; margin: 0; font-weight: bold;">Need to reschedule?</p>
          <p style="color: #333; margin: 10px 0 0;">Contact us and we'll help you find another suitable time slot.</p>
        </div>
      `}
      
      <p style="color: #333; margin: 25px 0 0; font-size: 16px; line-height: 1.6;">
        If you have any questions, simply reply to this email or call us at +91 98765 43210.
      </p>
    </div>
    ${getEmailFooter()}
  `;
};

export const getEnquiryAutoReplyTemplate = (name: string) => `
  ${getEmailHeader()}
  <div style="background: white; padding: 40px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #B15324; margin: 0 0 10px; font-size: 24px;">
        🙏 Thank You for Reaching Out!
      </h2>
    </div>
    
    <p style="color: #333; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    
    <p style="color: #333; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
      Thank you for contacting The Works! We've received your enquiry and our team will get back to you within <strong>24 hours</strong>.
    </p>
    
    <div style="background: #f8f9fa; border-left: 4px solid #B15324; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #B15324; margin: 0 0 15px; font-size: 18px;">What happens next?</h3>
      <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Our team will review your enquiry</li>
        <li>We'll prepare a personalized response</li>
        <li>You'll hear from us within 24 hours</li>
        <li>We might suggest a quick call to better understand your fitness goals</li>
      </ul>
    </div>
    
    <div style="background: #e8f4fd; border: 1px solid #2196f3; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
      <h4 style="color: #2196f3; margin: 0 0 15px;">Ready to start your fitness journey?</h4>
      <p style="color: #333; margin: 0 0 15px;">Follow us on social media for daily motivation and workout tips!</p>
      <a href="https://www.instagram.com/theworks.fitness" style="background: #B15324; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
        Follow @theworks.fitness
      </a>
    </div>
    
    <p style="color: #333; margin: 25px 0 0; font-size: 16px; line-height: 1.6;">
      In the meantime, feel free to explore our website or give us a call if you have any urgent questions.
    </p>
    
    <p style="color: #333; margin: 20px 0 0; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong>The Works Team</strong>
    </p>
  </div>
  ${getEmailFooter()}
`;

export const getEnquiryNotificationTemplate = (params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const { name, email, phone, message } = params;
  
  return `
    ${getEmailHeader()}
    <div style="background: white; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #B15324; margin: 0 0 10px; font-size: 24px;">
          🔔 New Enquiry Received
        </h2>
        <div style="background: #2196f3; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; font-weight: bold;">
          ACTION REQUIRED
        </div>
      </div>
      
      <div style="background: #f8f9fa; border-left: 4px solid #B15324; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #B15324; margin: 0 0 20px; font-size: 18px;">Customer Details</h3>
        <div style="display: grid; gap: 10px;">
          <p style="color: #333; margin: 0; font-size: 16px;"><strong>Name:</strong> ${name}</p>
          <p style="color: #333; margin: 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #B15324;">${email}</a></p>
          ${phone ? `<p style="color: #333; margin: 0; font-size: 16px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #B15324;">${phone}</a></p>` : ''}
        </div>
      </div>
      
      <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h4 style="color: #856404; margin: 0 0 15px;">Message from ${name}:</h4>
        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #ffc107;">
          <p style="color: #333; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:${email}?subject=Re: Your enquiry&body=Hi ${name},%0D%0A%0D%0AThank you for contacting The Works." 
           style="background: #B15324; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-right: 15px;">
          Reply via Email
        </a>
        ${phone ? `
        <a href="tel:${phone}" 
           style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Call Customer
        </a>
        ` : ''}
      </div>
      
      <div style="background: #e8f5e8; border: 1px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h4 style="color: #28a745; margin: 0 0 10px;">⏰ Response Time Goal</h4>
        <p style="color: #333; margin: 0;">Please respond within 24 hours to maintain our excellent customer service standards.</p>
      </div>
    </div>
    ${getEmailFooter()}
  `;
};
