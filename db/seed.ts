import { getDb } from "../api/queries/connection";
import { categories, products, orderItems, orders } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Clearing existing data...");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  console.log("Seeding database...");

  // ── Categories ──
  const smokehouseCats = [
    { name: "Smoked Meats", section: "SMOKEHOUSE" as const, slug: "smoked-meats", sortOrder: 1 },
    { name: "Sides", section: "SMOKEHOUSE" as const, slug: "sides", sortOrder: 2 },
    { name: "Sliders", section: "SMOKEHOUSE" as const, slug: "sliders", sortOrder: 3 },
    { name: "Other", section: "SMOKEHOUSE" as const, slug: "other", sortOrder: 4 },
  ];

  const butcherCats = [
    { name: "Beef", section: "BUTCHER" as const, slug: "beef", sortOrder: 1 },
    { name: "Pork", section: "BUTCHER" as const, slug: "pork", sortOrder: 2 },
    { name: "Poultry", section: "BUTCHER" as const, slug: "poultry", sortOrder: 3 },
    { name: "Specialty", section: "BUTCHER" as const, slug: "specialty", sortOrder: 4 },
  ];

  const allCats = [...smokehouseCats, ...butcherCats];
  const catResults: { id: number; slug: string }[] = [];
  for (const cat of allCats) {
    const [result] = await db.insert(categories).values(cat);
    catResults.push({ id: Number(result.insertId), slug: cat.slug });
  }
  console.log(`  Inserted ${catResults.length} categories`);

  const cid = (slug: string) => catResults.find((c) => c.slug === slug)?.id ?? 1;

  // ── Smokehouse Products ──
  const sh = [
    { name: "Smoked Brisket", description: "Slow-smoked for 14+ hours over hickory. Deep bark, tender interior, unmistakable smoke ring.", price: "1600", unit: "PER_KG" as const, cat: "smoked-meats", min: "0.5", max: "5", order: 1 },
    { name: "Smoked Beef Short Rib", description: "Massive beef ribs with a thick bark. Fall-off-the-bone tender with intense smoke flavor.", price: "1425", unit: "PER_KG" as const, cat: "smoked-meats", min: "0.5", max: "3", order: 2 },
    { name: "Smoked Beef Blade (Wagyu)", description: "Marbled Wagyu beef blade, smoked low and slow. Rich, buttery flavor.", price: "625", unit: "PER_KG" as const, cat: "smoked-meats", min: "0.5", max: "3", order: 3 },
    { name: "Smoked Pork Belly", description: "Crispy bark, juicy interior. Our signature pork belly with a sweet-savory glaze.", price: "425", unit: "PER_KG" as const, cat: "smoked-meats", min: "0.5", max: "3", order: 4 },
    { name: "Smoked Pork Ribs", description: "Full rack of St. Louis-cut ribs. Competition-quality bark and smoke penetration.", price: "425", unit: "PER_KG" as const, cat: "smoked-meats", min: "1", max: "5", order: 5 },
    { name: "Smoked Pulled Pork", description: "Hand-pulled pork shoulder. Perfect for sandwiches, tacos, or straight off the tray.", price: "300", unit: "PER_KG" as const, cat: "smoked-meats", min: "0.5", max: "5", order: 6 },

    { name: "Mac N Cheese", description: "Creamy, cheesy, with a crispy breadcrumb top. Comfort food perfection.", price: "450", unit: "PER_TRAY" as const, cat: "sides", order: 1 },
    { name: "BBQ Beans", description: "Slow-simmered with smoked pork, molasses, and our house BBQ sauce.", price: "350", unit: "PER_TRAY" as const, cat: "sides", order: 2 },
    { name: "Corn Bread", description: "Sweet, buttery cornbread. Baked fresh daily.", price: "179", unit: "PER_TRAY" as const, cat: "sides", order: 3 },
    { name: "Potato Salad", description: "Classic Southern-style with a creamy dressing, pickles, and herbs.", price: "230", unit: "PER_TRAY" as const, cat: "sides", order: 4 },
    { name: "Cob Salad", description: "Fresh greens, bacon, egg, avocado, and ranch dressing.", price: "225", unit: "PER_TRAY" as const, cat: "sides", order: 5 },
    { name: "Coleslaw", description: "Crisp cabbage with a tangy, creamy dressing. The perfect BBQ side.", price: "225", unit: "PER_TRAY" as const, cat: "sides", order: 6 },

    { name: "Pulled Pork Sliders (25pc)", description: "25 mini pulled pork sandwiches on brioche buns with coleslaw.", price: "625", unit: "PER_PACK" as const, cat: "sliders", order: 1 },
    { name: "Brisket Sliders (25pc)", description: "25 mini brisket sandwiches on brioche with pickles and sauce.", price: "675", unit: "PER_PACK" as const, cat: "sliders", order: 2 },
    { name: "Chicken Salad Sliders (25pc)", description: "25 mini chicken salad sandwiches. Light and refreshing.", price: "600", unit: "PER_PACK" as const, cat: "sliders", order: 3 },
    { name: "Beef Burger Sliders (25pc)", description: "25 mini beef burgers with cheese and caramelized onions.", price: "875", unit: "PER_PACK" as const, cat: "sliders", order: 4 },
    { name: "Chicken Burger Sliders (25pc)", description: "25 mini chicken burgers with lettuce and our special sauce.", price: "800", unit: "PER_PACK" as const, cat: "sliders", order: 5 },

    { name: "Smoked Chicken Wings (40pc)", description: "40 smoked and glazed chicken wings. Choose your sauce.", price: "395", unit: "PER_PACK" as const, cat: "other", order: 1 },
    { name: "Smoked Pork Belly Pinwheels", description: "Rolled pork belly with herbs and spices. Sliced into perfect bites.", price: "410", unit: "PER_KG" as const, cat: "other", min: "0.5", max: "3", order: 2 },
    { name: "Chicken Fingers (50pc)", description: "50 crispy chicken fingers with dipping sauces.", price: "385", unit: "PER_PACK" as const, cat: "other", order: 3 },
    { name: "Chicken Wings (40pc)", description: "40 classic fried chicken wings with your choice of sauce.", price: "375", unit: "PER_PACK" as const, cat: "other", order: 4 },
  ];

  const bh = [
    { name: "Whole Beef Brisket (Raw)", description: "Full packer brisket, untrimmed. 4-6kg average. Perfect for low-and-slow smoking at home.", price: "320", unit: "PER_KG" as const, cat: "beef", min: "3", max: "8", order: 1 },
    { name: "Beef Short Ribs (Raw)", description: "Meaty plate ribs. 2-3 bones per rack. Rich marbling, perfect for braising or smoking.", price: "280", unit: "PER_KG" as const, cat: "beef", min: "1", max: "4", order: 2 },
    { name: "Wagyu Blade (Raw)", description: "Highly marbled Wagyu beef blade. Tender and flavorful. Great for slow cooking.", price: "450", unit: "PER_KG" as const, cat: "beef", min: "1", max: "3", order: 3 },
    { name: "Ribeye Steak (Raw)", description: "Premium ribeye steaks, 2.5cm thick cut. Grass-fed, full of flavor.", price: "380", unit: "PER_KG" as const, cat: "beef", min: "0.5", max: "3", order: 4 },

    { name: "Whole Pork Belly (Raw)", description: "Skin-on pork belly. Beautiful fat cap, perfect for roasting or smoking.", price: "180", unit: "PER_KG" as const, cat: "pork", min: "2", max: "5", order: 1 },
    { name: "Pork Shoulder / Butt (Raw)", description: "Bone-in pork shoulder. The go-to cut for pulled pork. 3-5kg average.", price: "150", unit: "PER_KG" as const, cat: "pork", min: "2", max: "6", order: 2 },
    { name: "St. Louis Pork Ribs (Raw)", description: "Trimmed spare ribs, ready for the smoker. 1.2-1.5kg per rack.", price: "220", unit: "PER_KG" as const, cat: "pork", min: "1", max: "4", order: 3 },
    { name: "Pork Chops (Raw)", description: "Thick-cut bone-in pork chops. 2.5cm each. Juicy and flavorful.", price: "200", unit: "PER_KG" as const, cat: "pork", min: "0.5", max: "3", order: 4 },

    { name: "Whole Chicken (Raw)", description: "Free-range whole chickens. 1.5-2kg each. Perfect for roasting or smoking whole.", price: "120", unit: "PER_KG" as const, cat: "poultry", min: "1.5", max: "2.5", order: 1 },
    { name: "Chicken Wings (Raw)", description: "Whole chicken wings, tips on. 1kg packs. Great for smoking or frying.", price: "95", unit: "PER_KG" as const, cat: "poultry", min: "1", max: "5", order: 2 },
    { name: "Chicken Thighs (Raw)", description: "Bone-in, skin-on chicken thighs. Juicy and forgiving on the grill or smoker.", price: "110", unit: "PER_KG" as const, cat: "poultry", min: "0.5", max: "3", order: 3 },

    { name: "House-Made Sausages (Raw)", description: "Handmade pork sausages. 6 per pack. Choose from Italian, Bratwurst, or Spicy.", price: "85", unit: "PER_PACK" as const, cat: "specialty", order: 1 },
    { name: "Ground Beef (Raw)", description: "80/20 ground beef. 500g packs. Perfect for burgers, meatballs, or Bolognese.", price: "160", unit: "PER_PACK" as const, cat: "specialty", order: 2 },
    { name: "Bacon (Raw)", description: "House-cured smoked bacon. Thick cut. 500g packs.", price: "220", unit: "PER_PACK" as const, cat: "specialty", order: 3 },
  ];

  let count = 0;
  for (const p of [...sh, ...bh]) {
    await db.insert(products).values({
      name: p.name,
      description: p.description,
      price: p.price,
      priceUnit: p.unit,
      minWeightKg: p.min ?? null,
      maxWeightKg: p.max ?? null,
      categoryId: cid(p.cat),
      section: p.cat === "smoked-meats" || p.cat === "sides" || p.cat === "sliders" || p.cat === "other"
        ? "SMOKEHOUSE" : "BUTCHER",
      sortOrder: p.order,
    });
    count++;
  }
  console.log(`  Inserted ${count} products`);
  console.log("Seed complete!");
}

seed().catch(console.error);
