"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { productFormSchema as FormSchema } from "@/validators/forms";

import { cn } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
import SelectBox from "@/components/ui/select-box";

type props = {
  product: z.infer<typeof FormSchema>;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  colors: string[];
  sizes: string[];

  onSubmit: (values: z.infer<typeof FormSchema>) => void;
  isLoading?: boolean;
};

export default function ProductForm({ product, brands, categories, tags, colors, sizes, isLoading, onSubmit }: props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...product,
    },
    disabled: isLoading,
  });

  // for calculating the discount
  const price = +useWatch({
    control: form.control,
    name: "price",
  });
  const oldPrice = +(
    useWatch({
      control: form.control,
      name: "oldPrice",
    }) || "0"
  );
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!oldPrice || !price || price >= oldPrice) {
      setDiscount(0);
    } else {
      setDiscount(Math.round(Math.abs(1 - price / oldPrice) * 100));
    }
  }, [oldPrice, price, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-red-600 text-lg leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price <span className="text-red-600 text-lg leading-none">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" placeholder="price" {...field} />
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
                    <Input type="number" placeholder="old price" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={cn("size-12 rounded-full bg-red-600 flex items-center justify-center text-white mt-6 opacity-20 flex-shrink-0", discount && "opacity-100")}>{discount}%</div>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Suspense fallback={"loading..."}>
                    <ReactQuill theme="snow" {...field} className="[&_.ql-container]:min-h-52 [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md" />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="tagsIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <SelectBox options={tags.map((tag) => ({ value: tag.id, label: tag.name }))} value={field.value} onChange={field.onChange} placeholder="Select tag..." inputPlaceholder="Search tags" emptyPlaceholder="No tag found." multiple />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Colors</FormLabel>
                <SelectBox
                  options={colors.map((color) => ({
                    value: color,
                    label: (
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full" style={{ background: color }} />
                        <div>{color}</div>
                      </div>
                    ),
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select color..."
                  inputPlaceholder="Search colors"
                  emptyPlaceholder="No color found."
                  multiple
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sizes</FormLabel>
                <SelectBox options={sizes.map((size) => ({ value: size, label: size }))} value={field.value} onChange={field.onChange} placeholder="Select size..." inputPlaceholder="Search size" emptyPlaceholder="No size found." multiple />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="ml-auto mt-3 flex" type="submit" state={isLoading ? "loading" : "default"}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
