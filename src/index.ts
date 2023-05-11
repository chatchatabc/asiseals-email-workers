import productsJson from "../data/products.json";
import { Hono } from "hono";
import { productFindBySlug } from "./domain/service/productService";
import { emailSend } from "./domain/service/emailService";

export type Env = {
  SEB: SendEmail;
};

const app = new Hono<{ Bindings: Env }>();

app.post("/", async (c) => {
  // Parse the request body as JSON
  const dataJson: Record<string, any> = await c.req.json();
  // Clean empty values
  const data = Object.fromEntries(
    Object.entries(dataJson).filter(([_, v]) => v !== "")
  );
  // Validate the data
  if (!data.name || !data.email || !data.message) {
    return new Response("Missing data", { status: 400 });
  }

  // Find product
  const product = productFindBySlug(data.slug);
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

  const email = await emailSend(dataJson, c.env, product);

  if (!email) {
    return new Response(
      JSON.stringify({
        message: `Error sending email`,
      }),
      {
        status: 500,
      }
    );
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
});

app.all("*", (c) => {
  return c.json({ message: "Not found" }, { status: 404 });
});

export default app;
