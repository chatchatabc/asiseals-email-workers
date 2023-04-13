import zod from "zod";

export const contactSchema = zod.object({
  name: zod.string().min(1).max(100),
  email: zod.string().email().min(1).max(100),
  companyName: zod.string().min(1).max(100).nullish(),
  telephone: zod.string().min(1).max(100).nullish(),
  message: zod.string().min(1).max(1000),
  productSlug: zod.string().min(1).max(100).nullish(),
});
