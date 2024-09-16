import ProductDetails from "@/components/product/product-details";
import { requestData } from "@/lib/server/request-data";
import client from "@/server/client";

type props = { params: { id: string } };

export default async function ProductsPage({ params: { id } }: props) {
  const productRes = await requestData(client.api.v1.products[":productId"], "$get", { param: { productId: id } });

  if (productRes.isError) return <div>something went wrong while fetching the data.</div>;

  return (
    <div>
      <ProductDetails product={productRes.data} />
      <div className="h-[50vh]" />
    </div>
  );
}
