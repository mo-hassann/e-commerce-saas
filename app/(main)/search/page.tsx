import ProductFiltersSidebar from "@/components/product/product-filters-sidebar";
import ProductsContainer from "@/components/product/products-container";

export default function SearchPage() {
  return (
    <div className="flex gap-4">
      <ProductFiltersSidebar />
      <ProductsContainer />
    </div>
  );
}
