import { sendEmail } from "../utils/sendEmail.js";

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 1. Send email to admin (you)
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Newsletter Subscriber",
      html: `<p>A new user subscribed with the email: <b>${email}</b></p>`,
    });

    // 2. Send automatic email to user
    await sendEmail({
      to: email,
      subject: "Subscription Successful!",
      html: `
        <h3>Thank you for joining our Modest Fashion Family! 💛</h3>
        <p>You’ll now receive updates on new collections, tutorials, and exclusive discounts.</p>
        <p>Stay classy, stay modest ✨</p>
      `,
    });

    res.status(200).json({ message: "Subscription successful!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Email failed to send" });
  }
};
