"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { productFormSchema as FormSchema } from "@/validators/forms";
// import useProduct from "@/query-hooks/dashboard/use-new-product";
import useProductSheet from "@/hooks/dashboard/use-product-sheet";
import { cn } from "@/lib/utils";
import { ColorT, SizeT } from "@/db/schemas/enums";
import { useEffect, useState } from "react";

type props = {
  product: z.infer<typeof FormSchema>;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  colors: string[];
  sizes: string[];
};

export default function ProductForm({ product, brands, categories, tags }: props) {
  //   const productMutation = useProduct();
  const productSheet = useProductSheet();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...product,
    },
    // disabled: productMutation.isPending,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // productMutation.mutate(data, {
    //   onSuccess: () => {
    //     form.reset();
    //     productSheet.onClose();
    //   },
    // });
  }

  const [curPrice, setCurPrice] = useState(0);
  const [curOldPrice, setCurOldPice] = useState<number | undefined>(0);
  const discount = curOldPrice ? Math.round(Math.abs(1 - curOldPrice / curPrice) * 100) : null;

  useEffect(() => {
    if (!curOldPrice) return;
    if (curPrice > curOldPrice) setCurOldPice(0);
    // if(curPrice < curOldPrice) form.setValue("price", curOldPrice);
  }, [curPrice, curOldPrice]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-600 text-lg">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-red-600 text-lg">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="price" {...field} onChange={(e) => setCurPrice(+e.target.value > 0 ? +e.target.value : 0)} value={curPrice} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oldPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="old price" {...field} onChange={(e) => setCurOldPice(+e.target.value && +e.target.value > 0 ? +e.target.value : 0)} value={curOldPrice} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn("size-12 rounded-full bg-red-600 flex items-center justify-center text-white mt-auto opacity-0", discount && "opacity-100")}>{discount}%</div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" /* state={productMutation.isPending ? "loading" : "default"} */>Submit</Button>
      </form>
    </Form>
  );
}
