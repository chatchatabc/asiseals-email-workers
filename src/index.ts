import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export interface Env {
  SEB: SendEmail;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const msg = createMimeMessage();

    msg.setSender({
      name: "Asiseal Contact Us Form",
      addr: "contact_form@bonkind.xyz",
    });
    msg.setRecipient("bonjomontes@gmail.com");
    msg.setSubject("An email generated in a worker");
    msg.addMessage({ contentType: "text/plain", data: "Hello, world!" });

    var message = new EmailMessage(
      "contact_form@bonkind.xyz",
      "bonjomontes@gmail.com",
      msg.asRaw()
    );
    try {
      await env.SEB.send(message);
    } catch (e: any) {
      return new Response(e, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  },
};
