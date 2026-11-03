import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import {
  getProductBySlug,
  getRelatedProducts,
  listProducts,
} from "@/api/products";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan | Schooly Shop" };
  return {
    title: `${product.name} | Schooly Shop`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return <ProductDetail product={product} related={getRelatedProducts(product)} />;
}