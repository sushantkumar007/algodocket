import Mailgen from "mailgen";
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMail = async ({ to, subject, text, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: [to],
    subject,
    text,
    html
  });

  if (error) {
    throw new Error(error.message)
  }
  
  return data
};

const mailGenerator = new Mailgen({
  theme: 'default',
    product: {
        name: 'Algodocket',
        link: 'http://algodocket.com/'
    }
});

const emailVerificationBody = (name, emailVerificationLink) => {
  const email = {
    body: {
      name,
      intro: "Welcome to Algodocket! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Algodocket, please click here:",
        button: {
          color: "#22BC66",
          text: "verify your email",
          link: emailVerificationLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const html = mailGenerator.generate(email);
  const text = mailGenerator.generatePlaintext(email);

  return { html, text };
};

const resetPasswordBody = (name, resetPasswordLink) => {
  const email = {
    body: {
      name,
      intro: "Welcome to Algodocket! We're very excited to have you on board.",
      action: {
        instructions: "To reset your password , please click here:",
        button: {
          color: "#22BC66",
          text: "reset your password",
          link: resetPasswordLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const html = mailGenerator.generate(email);
  const text = mailGenerator.generatePlaintext(email);

  return { html, text };
};

export default sendMail;
export { emailVerificationBody, resetPasswordBody };
