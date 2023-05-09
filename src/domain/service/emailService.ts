import { createMimeMessage } from "mimetext";
import emailsJson from "../../../data/emails.json";
import { EmailMessage } from "cloudflare:email";
import { Env } from "../..";

export async function emailSend(
  data: Record<string, any>,
  env: Env,
  product?: any
) {
  // Destructure the data
  const { name, email, companyName, telephone, message } = data;

  // Format date and time
  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
  }).format(date);

  // Create the email message
  const msg = createMimeMessage();
  msg.setSender({
    name: emailsJson.sender.name,
    addr: emailsJson.sender.email,
  });
  msg.setRecipient(emailsJson.receiver.email);
  msg.setSubject(emailsJson.subject);
  msg.addMessage({
    contentType: "text/html",
    data: `
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.4;
          color: #333;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 10px;
        }
        strong {
          font-weight: bold;
        }
        a {
          color: #0078ae;
          text-decoration: none;
        }
        img {
          display: block;
          margin-top: 20px;
          max-width: 100%;
          height: auto;
        }
        /* Responsive styles */
        @media screen and (max-width: 600px) {
          body {
            font-size: 14px;
          }
          h1 {
            font-size: 24px;
          }
        }
      </style>
      <div style="max-width: 600px; margin: 0 auto;">
        <h1>Contact Us Form Submission</h1>
        <p><strong>Date:</strong> ${dateFormatted}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Telephone:</strong> ${telephone}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${
          product ? "<p><strong>Product:</strong> " + product.name + "</p>" : ""
        }
        ${
          product
            ? "<p><strong>Product Link:</strong> " +
              `<a href="https://asiseals.pages.dev/products/${product.category}/${product.subCategory}/${product.slug}">https://asiseals.pages.dev/products/${product.category}/${product.subCategory}/${product.slug}</a>` +
              "</p>"
            : ""
        }
        ${
          product
            ? `<img src="https://asiseals.pages.dev/${product.imageUrl}" alt="${product.name}" />`
            : ""
        }
      </div>
  `,
  });

  // Attach the email message to the EmailMessage object
  var emailMessage = new EmailMessage(
    emailsJson.sender.email, // sender
    emailsJson.receiver.email, // recipient
    msg.asRaw()
  );

  try {
    await env.SEB.send(emailMessage);
    return true;
  } catch (e: any) {
    return false;
  }
}
