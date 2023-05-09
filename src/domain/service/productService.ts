import productsJson from "../../../data/products.json";

export function productFindBySlug(slug: string) {
  // Find product
  const product = productsJson.contents.find(
    (product) => product.slug === slug
  );

  return product;
}
