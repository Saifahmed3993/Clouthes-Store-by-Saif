import { products } from "@/utils/seed-data";

describe("product seed data", () => {
  it("contains shoppable products with images and sizes", () => {
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.images.length > 0 && product.sizes.length > 0)).toBe(true);
  });
});
