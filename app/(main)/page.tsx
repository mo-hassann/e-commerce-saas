import ProductsContainer from "@/components/product/products-container";

export default function Home() {
  return (
    <div className="p-6">
      <h1>some products</h1>
      <ProductsContainer />;
    </div>
  );
}
