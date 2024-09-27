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
import useProduct from "@/query-hooks/product/use-product";
import { productFormSchema } from "@/validators/forms";

export default function ProductSheet() {
  const { isOpen, onClose, id } = useProductSheet();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-screen-xl w-[90%]">
        <DialogHeader>
          <DialogTitle>Product Dialog</DialogTitle>
        </DialogHeader>
        <SheetBody productId={id} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

const SheetBody = ({ productId, onClose }: { productId?: string; onClose: () => void }) => {
  const productQuery = useGetProduct({ productId });
  const categoryQuery = useGetCategories();
  const brandsQuery = useGetBrands();
  const tagsQuery = useGetTags();
  const productMutation = useProduct();

  if (productId) {
    if (productQuery.isPending || productQuery.isLoading) return <Spinner />;
  }

  if (categoryQuery.isPending || categoryQuery.isLoading || brandsQuery.isPending || brandsQuery.isLoading || tagsQuery.isPending || tagsQuery.isLoading) return <Spinner />;

  if (productQuery.isError || categoryQuery.isError || brandsQuery.isError || tagsQuery.isError || tagsQuery.isError) return <div>Something went wrong while fetching the data.</div>;

  const product = productQuery.data;

  return (
    <ProductForm
      product={{
        id: product?.id,
        name: product?.name || "",
        price: +(product?.price || 0),
        oldPrice: Number(product?.oldPrice) || undefined,
        description: product?.description || undefined,
        images: product?.productImages.map(({ id }) => id),
        stock: product?.stock || undefined,
        brandId: product?.brand?.id,
        categoryId: product?.category?.id,
        tagsIds: product?.tags.map((tag) => tag.id),
        colors: product?.properties.colors.map(({ color }) => color),
        sizes: product?.properties.sizes.map(({ size }) => size),
      }}
      brands={brandsQuery.data}
      categories={categoryQuery.data}
      tags={tagsQuery.data}
      sizes={sizeEnum.enumValues}
      colors={colorEnum.enumValues}
      onSubmit={(values) => productMutation.mutate(values, { onSuccess: () => onClose() })}
      isLoading={productMutation.isPending}
    />
  );
};
