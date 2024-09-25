import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import useProductSheet from "@/hooks/dashboard/use-product-sheet";

import useGetProduct from "@/query-hooks/product/use-get-product";
import ProductForm from "../forms/product-form";
import Spinner from "@/components/global/spinner";
import useGetCategories from "@/query-hooks/categories/use-get-categories";
import useGetBrands from "@/query-hooks/brands/use-get-brands";
import useGetTags from "@/query-hooks/tags/use-get-tags";
import useGetProductProperties from "@/query-hooks/product/use-get-product-properties";
import { colorEnum, sizeEnum } from "@/db/schemas/enums";

export default function ProductSheet() {
  const { isOpen, onClose, id } = useProductSheet();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Dialog</DialogTitle>
        </DialogHeader>
        <SheetBody productId={id} />
      </DialogContent>
    </Dialog>
  );
}

const SheetBody = ({ productId }: { productId?: string }) => {
  const productQuery = useGetProduct({ productId });
  const categoryQuery = useGetCategories();
  const brandsQuery = useGetBrands();
  const tagsQuery = useGetTags();

  if (productId) {
    if (productQuery.isPending || productQuery.isLoading) return <Spinner />;
  }

  if (categoryQuery.isPending || categoryQuery.isLoading || brandsQuery.isPending || brandsQuery.isLoading || tagsQuery.isPending || tagsQuery.isLoading) return <Spinner />;

  if (productQuery.isError || categoryQuery.isError || brandsQuery.isError || tagsQuery.isError || tagsQuery.isError) return <div>Something went wrong while fetching the data.</div>;

  const product = productQuery.data;

  return (
    <ProductForm
      product={{
        name: product?.name || "",
        price: +(product?.price || 1),
        oldPrice: +(product?.oldPrice || 0) || undefined,
        description: product?.description || "",
        images: product?.productImages.map(({ id }) => id) || [],
        tagsIds: [],
        quantity: 0,
        brandId: undefined,
        categoryId: "",
        colors: product?.properties.colors.map(({ color }) => color) || [],
        sizes: product?.properties.sizes.map(({ size }) => size) || [],
      }}
      tags={tagsQuery.data}
      brands={brandsQuery.data}
      categories={categoryQuery.data}
      colors={colorEnum.enumValues}
      sizes={sizeEnum.enumValues}
    />
  );
};
