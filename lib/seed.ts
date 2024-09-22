/* import db from "@/db";

import { userTable, storeTable, categoryTable, tagTable, brandTable, productTable, productTagTable, promoCodeTable } from "@/db/schemas";

async function seedData() {
  // 1. Seed a user (store admin)
  const [adminUser] = await db
    .insert(userTable)
    .values({
      name: "John Doe",
      username: "johndoe",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "ADMIN",
    })
    .returning();

  // 2. Seed a store
  const [store] = await db
    .insert(storeTable)
    .values({
      name: "Tech Store",
      description: "A store that sells tech gadgets.",
      adminId: adminUser.id, // Reference the admin user
    })
    .returning();

  // 3. Seed categories
  const [category1, category2] = await db
    .insert(categoryTable)
    .values([{ name: "Laptops" }, { name: "Smartphones" }])
    .returning();

  // 4. Seed tags
  const [tagNew, tagHot] = await db
    .insert(tagTable)
    .values([{ name: "New" }, { name: "Hot" }])
    .returning();

  // 5. Seed brands
  const [brandApple, brandSamsung] = await db
    .insert(brandTable)
    .values([{ name: "Apple" }, { name: "Samsung" }])
    .returning();

  // 6. Seed products
  const products = await db
    .insert(productTable)
    .values([
      {
        title: "iPhone 14",
        description: "Latest iPhone model",
        price: "999.99",
        discountedPrice: "899.99",
        categoryId: category2.id, // Smartphones
        brandId: brandApple.id, // Apple
        adminId: adminUser.id,
        storeId: store.id,
        rating: "4.8",
        reviewedNumber: 120,
        purchases: 50,
      },
      {
        title: "MacBook Pro 2023",
        description: "Apple’s latest MacBook Pro",
        price: "1999.99",
        discountedPrice: "1799.99",
        categoryId: category1.id, // Laptops
        brandId: brandApple.id, // Apple
        adminId: adminUser.id,
        storeId: store.id,
        rating: "4.9",
        reviewedNumber: 200,
        purchases: 80,
      },
      {
        title: "Samsung Galaxy S23",
        description: "Samsung’s flagship smartphone",
        price: "899.99",
        categoryId: category2.id, // Smartphones
        brandId: brandSamsung.id, // Samsung
        adminId: adminUser.id,
        storeId: store.id,
        rating: "4.7",
        reviewedNumber: 90,
        purchases: 70,
      },
      // Add more products up to 15...
    ])
    .returning();

  // 7. Seed product properties (for each product)
  await db.insert(productPropertiesTable).values([
    {
      productId: products[0].id,
      size: "M", // Enum: XS, S, M, L, XL, XXL
      color: "Black",
      stock: 20,
    },
    {
      productId: products[1].id,
      size: "L",
      color: "Silver",
      stock: 15,
    },
    {
      productId: products[2].id,
      size: "XL",
      color: "Blue",
      stock: 30,
    },
    // Add properties for other products...
  ]);

  // 8. Seed product tags (for some products)
  await db.insert(productTagTable).values([
    { productId: products[0].id, tagId: tagNew.id },
    { productId: products[1].id, tagId: tagHot.id },
    { productId: products[2].id, tagId: tagNew.id },
  ]);

  // 9. Seed promo codes
  await db.insert(promoCodeTable).values([
    {
      adminId: adminUser.id,
      code: "SAVE10",
      discount: "0.10", // 10% discount
      validUntil: new Date("2024-12-31"),
    },
    {
      adminId: adminUser.id,
      code: "APPLE20",
      discount: "20",
      validUntil: new Date("2024-11-30"),
    },
  ]);

  console.log("Seeding completed.");
}

seedData().catch((error) => console.error(error));
 */
