import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsView } from "@/features/products/components/product-details-view";
import { productService } from "@/features/products/services/products.service";
import { products } from "@/utils/seed-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found"
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }]
    }
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await productService.getProduct(slug);
    return <ProductDetailsView product={product} />;
  } catch {
    notFound();
  }
}
