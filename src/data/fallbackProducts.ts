export const fallbackCategories = [
  { id: 1, name: "Smoked Meats", section: "SMOKEHOUSE", slug: "smoked-meats", sortOrder: 1, isActive: "true" as const, createdAt: new Date() },
  { id: 2, name: "Sides", section: "SMOKEHOUSE", slug: "sides", sortOrder: 2, isActive: "true" as const, createdAt: new Date() },
  { id: 3, name: "Sliders", section: "SMOKEHOUSE", slug: "sliders", sortOrder: 3, isActive: "true" as const, createdAt: new Date() },
  { id: 4, name: "Other", section: "SMOKEHOUSE", slug: "other", sortOrder: 4, isActive: "true" as const, createdAt: new Date() },
  { id: 5, name: "Beef", section: "BUTCHER", slug: "beef", sortOrder: 1, isActive: "true" as const, createdAt: new Date() },
  { id: 6, name: "Pork", section: "BUTCHER", slug: "pork", sortOrder: 2, isActive: "true" as const, createdAt: new Date() },
  { id: 7, name: "Poultry", section: "BUTCHER", slug: "poultry", sortOrder: 3, isActive: "true" as const, createdAt: new Date() },
  { id: 9, name: "Red Wine", section: "WINE", slug: "red-wine", sortOrder: 1, isActive: "true" as const, createdAt: new Date() },
  { id: 10, name: "White Wine", section: "WINE", slug: "white-wine", sortOrder: 2, isActive: "true" as const, createdAt: new Date() },
  { id: 11, name: "Sparkling & Champagne", section: "WINE", slug: "sparkling-champagne", sortOrder: 3, isActive: "true" as const, createdAt: new Date() },
  { id: 12, name: "Rosé", section: "WINE", slug: "rose", sortOrder: 4, isActive: "true" as const, createdAt: new Date() },
];

export const fallbackProducts = [
  // SMOKEHOUSE - Smoked Meats
  { id: 1, name: "Smoked Brisket", description: "Slow-smoked for 14+ hours over hickory. Deep bark, tender interior, unmistakable smoke ring.", price: "1600", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "5", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 1, images: null },
  { id: 2, name: "Smoked Beef Short Rib", description: "Massive beef ribs with a thick bark. Fall-off-the-bone tender with intense smoke flavor.", price: "1425", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "3", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 2, images: null },
  { id: 3, name: "Smoked Beef Blade (Wagyu)", description: "Marbled Wagyu beef blade, smoked low and slow. Rich, buttery flavor.", price: "625", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "3", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 3, images: null },
  { id: 4, name: "Smoked Pork Belly", description: "Crispy bark, juicy interior. Our signature pork belly with a sweet-savory glaze.", price: "425", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "3", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 4, images: null },
  { id: 5, name: "Smoked Pork Ribs", description: "Full rack of St. Louis-cut ribs. Competition-quality bark and smoke penetration.", price: "425", priceUnit: "PER_KG" as const, minWeightKg: "1", maxWeightKg: "5", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 5, images: null },
  { id: 6, name: "Smoked Pulled Pork", description: "Hand-pulled pork shoulder. Perfect for sandwiches, tacos, or straight off the tray.", price: "300", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "5", weightStep: "0.5", categoryId: 1, section: "SMOKEHOUSE" as const, sortOrder: 6, images: null },
  // SMOKEHOUSE - Sides
  { id: 7, name: "Mac N Cheese", description: "Creamy, cheesy, with a crispy breadcrumb top. Comfort food perfection.", price: "450", priceUnit: "PER_TRAY" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 2, section: "SMOKEHOUSE" as const, sortOrder: 1, images: null },
  { id: 8, name: "BBQ Beans", description: "Slow-simmered with smoked pork, molasses, and our house BBQ sauce.", price: "350", priceUnit: "PER_TRAY" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 2, section: "SMOKEHOUSE" as const, sortOrder: 2, images: null },
  { id: 9, name: "Corn Bread", description: "Sweet, buttery cornbread. Baked fresh daily.", price: "179", priceUnit: "PER_TRAY" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 2, section: "SMOKEHOUSE" as const, sortOrder: 3, images: null },
  { id: 10, name: "Potato Salad", description: "Classic Southern-style with a creamy dressing, pickles, and herbs.", price: "230", priceUnit: "PER_TRAY" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 2, section: "SMOKEHOUSE" as const, sortOrder: 4, images: null },
  { id: 11, name: "Coleslaw", description: "Crisp cabbage with a tangy, creamy dressing. The perfect BBQ side.", price: "225", priceUnit: "PER_TRAY" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 2, section: "SMOKEHOUSE" as const, sortOrder: 5, images: null },
  // SMOKEHOUSE - Sliders
  { id: 12, name: "Pulled Pork Sliders (25pc)", description: "25 mini pulled pork sandwiches on brioche buns with coleslaw.", price: "625", priceUnit: "PER_PACK" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 3, section: "SMOKEHOUSE" as const, sortOrder: 1, images: null },
  { id: 13, name: "Brisket Sliders (25pc)", description: "25 mini brisket sandwiches on brioche with pickles and sauce.", price: "675", priceUnit: "PER_PACK" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 3, section: "SMOKEHOUSE" as const, sortOrder: 2, images: null },
  { id: 14, name: "Beef Burger Sliders (25pc)", description: "25 mini beef burgers with cheese and caramelized onions.", price: "875", priceUnit: "PER_PACK" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 3, section: "SMOKEHOUSE" as const, sortOrder: 3, images: null },
  // BUTCHER - Beef
  { id: 15, name: "Whole Beef Brisket (Raw)", description: "Full packer brisket, untrimmed. 4-6kg average. Perfect for low-and-slow smoking at home.", price: "320", priceUnit: "PER_KG" as const, minWeightKg: "3", maxWeightKg: "8", weightStep: "0.5", categoryId: 5, section: "BUTCHER" as const, sortOrder: 1, images: null },
  { id: 16, name: "Beef Short Ribs (Raw)", description: "Meaty plate ribs. 2-3 bones per rack. Rich marbling, perfect for braising or smoking.", price: "280", priceUnit: "PER_KG" as const, minWeightKg: "1", maxWeightKg: "4", weightStep: "0.5", categoryId: 5, section: "BUTCHER" as const, sortOrder: 2, images: null },
  { id: 17, name: "Wagyu Blade (Raw)", description: "Highly marbled Wagyu beef blade. Tender and flavorful. Great for slow cooking.", price: "450", priceUnit: "PER_KG" as const, minWeightKg: "1", maxWeightKg: "3", weightStep: "0.5", categoryId: 5, section: "BUTCHER" as const, sortOrder: 3, images: null },
  { id: 18, name: "Ribeye Steak (Raw)", description: "Premium ribeye steaks, 2.5cm thick cut. Grass-fed, full of flavor.", price: "380", priceUnit: "PER_KG" as const, minWeightKg: "0.5", maxWeightKg: "3", weightStep: "0.25", categoryId: 5, section: "BUTCHER" as const, sortOrder: 4, images: null },
  // BUTCHER - Pork
  { id: 19, name: "Whole Pork Belly (Raw)", description: "Skin-on pork belly. Beautiful fat cap, perfect for roasting or smoking.", price: "180", priceUnit: "PER_KG" as const, minWeightKg: "2", maxWeightKg: "5", weightStep: "0.5", categoryId: 6, section: "BUTCHER" as const, sortOrder: 1, images: null },
  { id: 20, name: "Pork Shoulder / Butt (Raw)", description: "Bone-in pork shoulder. The go-to cut for pulled pork. 3-5kg average.", price: "150", priceUnit: "PER_KG" as const, minWeightKg: "2", maxWeightKg: "6", weightStep: "0.5", categoryId: 6, section: "BUTCHER" as const, sortOrder: 2, images: null },
  { id: 21, name: "St. Louis Pork Ribs (Raw)", description: "Trimmed spare ribs, ready for the smoker. 1.2-1.5kg per rack.", price: "220", priceUnit: "PER_KG" as const, minWeightKg: "1", maxWeightKg: "4", weightStep: "0.5", categoryId: 6, section: "BUTCHER" as const, sortOrder: 3, images: null },
  // BUTCHER - Poultry
  { id: 22, name: "Whole Chicken (Raw)", description: "Free-range whole chickens. 1.5-2kg each. Perfect for roasting or smoking whole.", price: "120", priceUnit: "PER_KG" as const, minWeightKg: "1.5", maxWeightKg: "2.5", weightStep: "0.5", categoryId: 7, section: "BUTCHER" as const, sortOrder: 1, images: null },
  { id: 23, name: "Chicken Wings (Raw)", description: "Whole chicken wings, tips on. 1kg packs. Great for smoking or frying.", price: "95", priceUnit: "PER_KG" as const, minWeightKg: "1", maxWeightKg: "5", weightStep: "0.5", categoryId: 7, section: "BUTCHER" as const, sortOrder: 2, images: null },
  // WINE - Red Wine
  { id: 24, name: "Cabernet Sauvignon", description: "Full-bodied red with notes of blackcurrant and cedar. Pairs perfectly with smoked brisket.", price: "380", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 9, section: "WINE" as const, sortOrder: 1, images: null },
  { id: 25, name: "Malbec Reserva", description: "Rich and velvety Argentine Malbec. Bold tannins that stand up to smoked meats.", price: "340", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 9, section: "WINE" as const, sortOrder: 2, images: null },
  // WINE - White Wine
  { id: 26, name: "Chardonnay", description: "Crisp and buttery with hints of vanilla oak. A great match for smoked poultry.", price: "310", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 10, section: "WINE" as const, sortOrder: 1, images: null },
  { id: 27, name: "Sauvignon Blanc", description: "Zesty and refreshing with citrus and green apple notes. Pairs well with sides.", price: "295", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 10, section: "WINE" as const, sortOrder: 2, images: null },
  // WINE - Sparkling & Champagne
  { id: 28, name: "Prosecco", description: "Light, fruity Italian sparkling wine. Great for celebrations.", price: "260", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 11, section: "WINE" as const, sortOrder: 1, images: null },
  { id: 29, name: "Champagne Brut", description: "Classic French champagne. Fine bubbles, elegant and dry.", price: "780", priceUnit: "PER_PIECE" as const, minWeightKg: null, maxWeightKg: null, weightStep: null, categoryId: 11, section: "WINE" as const, sortOrder: 2, images: null },
];
