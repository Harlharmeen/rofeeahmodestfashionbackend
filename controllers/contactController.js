import { sendEmail } from "../utils/sendEmail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Send message to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    // Auto-reply to customer
    await sendEmail({
      to: email,
      subject: "We Received Your Message 💛",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for contacting Rofeeah Modest Fashion.</p>
        <p>We received your message and will respond shortly inshaAllah.</p>
        <p>Warm regards,</p>
        <p><b>Rofeeah Modest Fashion</b></p>
      `,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error sending message." });
  }
};
