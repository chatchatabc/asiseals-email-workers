import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";
import { contactSchema } from "./domain/schemas/contactSchema";
import productsJson from "../data/products.json";

export interface Env {
  SEB: SendEmail;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { method } = request;

    // Check if the request is a POST request
    if (method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Parse the request body as JSON
    const dataJson: Record<string, any> = await request.json();
    // Clean empty values
    const data = Object.fromEntries(
      Object.entries(dataJson).filter(([_, v]) => v !== "")
    );

    // Validate the data
    const { success } = contactSchema.safeParse(data);
    if (!success) {
      return new Response("Invalid data", { status: 400 });
    }

    // Find product
    const product = productsJson.contents.find(
      (product) => product.slug === data.slug
    );

    // Return error if product not found
    if (data.slug && !product) {
      return new Response(
        JSON.stringify({
          message: `No product found for ${data.slug} from ${productsJson.contents.length} products}`,
        }),
        {
          status: 404,
        }
      );
    }

    // Format date and time
    const date = new Date();
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
    }).format(date);

    // Destructure the data
    const { name, email, companyName, telephone, message } = data;

    // Create the email message
    const msg = createMimeMessage();
    msg.setSender({
      name: "Asiseal Contact Us Form",
      addr: "contact_form@bonkind.xyz",
    });
    msg.setRecipient("bonjomontes@gmail.com");
    msg.setSubject("An email generated in a worker");
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
    				${product ? "<p><strong>Product:</strong> " + product.name + "</p>" : ""}
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
      "contact_form@bonkind.xyz", // sender
      "bonjomontes@gmail.com", // recipient
      msg.asRaw()
    );

    try {
      await env.SEB.send(emailMessage);
    } catch (e: any) {
      return new Response(e, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
    });
  },
};
