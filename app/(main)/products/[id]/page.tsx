import ProductDetails from "@/components/product/product-details";

type props = { params: { id: string } };

export default function ProductsPage({ params: { id } }: props) {
  return (
    <div>
      <ProductDetails productId={id} />
      <div className="h-[50vh]" />
    </div>
  );
}
