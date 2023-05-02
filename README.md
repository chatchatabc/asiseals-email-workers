# Asiseals Email Workers

This repository is used to save the code that is used for running the email workers for Asiseals website. The main purpose of this project is to handle sending of emails from Cloudflare Service Workers.

## Techstack

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare Email Workers: https://developers.cloudflare.com/email-routing/email-workers/

### Cloudflare Workers

`Cloudflare Workers` provides a serverless execution environment that allows you to create new applications or augment existing ones without configuring or maintaining infrastructure.

`Cloudflare Workers` is used in order for our `Email Workers` to work on the **Cloudflare Edge Servers** around the globe.

### Cloudflare Email Workers

You can programmatically send some emails from your Workers to a verified email address registered in your `Email Routing`. Learn more [here](https://developers.cloudflare.com/email-routing/), on how to get started with `Email Routing`.

## Instructions

### Binding Email Accounts

1. Enable `Email Routing` in your Cloudflare account by adding an existing email address and verifying it. For more information, just click [here](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/).
2. After enabling `Email Routing`, make sure to add two custom addresses. Those two custom addresses will serve as your sender and receiver. Example:
   1. sender@custom_domain.com
3. [Open](./wrangler.toml) `wrangler.toml` and configure some variables that would work on your situation. Example:

```toml
send_email = [
  { type = "send_email", name = "SEB", allowed_destination_addresses = [
    "receiver@gmail.com",
  ] },
]

# Make sure that the receiver email address has been verified in your Cloudflare Email Routing, unless it would not work.
```

4. [Open](./data/emails.json) `/data/emails.json` and configure some values in the file. Make sure that the values of the email address are the same you've set in the `Email Routing` in step 1.

```js
{
  receiver: {
    email: "receiver@gmail.com"
    name: "Any name is okay (?)"
  },
  sender: {
    email: "sender@custom_domain.com"
    name: "Any name is okay (?)"
  }
}

// Make sure that the sender email address is registered in your Cloudflare Email Routing Custom Addresses, unless it would not work.
// Make sure that the receiver email address has been verified in your Cloudflare Email Routing, unless it would not work.
```

### Deployment

After finishing the required configuration, just run `npm run deploy` in project's terminal, and it will deploy on the Cloudflare platform. You could find your deployed Workers project in your `Cloudflare Dashboard > Workers`.
