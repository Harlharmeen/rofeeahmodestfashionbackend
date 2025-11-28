import { sendEmail } from "../utils/sendEmail.js";

export const submitEntry = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const file = req.file;

    if (!name || !email || !message || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Send email to admin with attachment
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Customer Shoutout Submission 💛",
      html: `
        <h3>New Submission Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
        <p>Image attached.</p>
      `,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    });

    // Send acknowledgment email to customer
    await sendEmail({
      to: email,
      subject: "Thanks for Your Submission! 🤎",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for sending your photo for our Customer Shout-Out!</p>
        <p>We appreciate your engagement and will feature your image soon.</p>
        <p>Stay modest, stay elegant ✨</p>
      `,
    });

    res.status(200).json({ message: "Submission sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
