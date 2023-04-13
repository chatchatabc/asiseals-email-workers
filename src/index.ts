import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export interface Env {
  SEB: SendEmail;
  KV: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const msg = createMimeMessage();

    msg.setSender({ name: "GPT-4", addr: "bon@bonkind.xyz" });
    msg.setRecipient("bonjomontes@gmail.com");
    msg.setSubject("An email generated in a worker");
    msg.addMessage({ contentType: "text/plain", data: "Hello, world!" });

    var message = new EmailMessage(
      "bon@bonkind.xyz",
      "bonjomontes@gmail.com",
      msg.asRaw()
    );
    try {
      await env.SEB.send(message);
    } catch (e: any) {
      return new Response(e);
    }

    return new Response("Hello Send Email World!");
  },
};
