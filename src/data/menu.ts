import type { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // MEAT
  { id: 'meat-1', category: 'MEAT', name: 'Smoked Brisket', price: 1600, priceUnit: 'KG', priceSuffix: 'KG', isActive: true, sortOrder: 1 },
  { id: 'meat-2', category: 'MEAT', name: 'Smoked Beef Short Rib', price: 1425, priceUnit: 'RACK', priceSuffix: 'RACK', isActive: true, sortOrder: 2 },
  { id: 'meat-3', category: 'MEAT', name: 'Smoked Beef Blade Wagyu', price: 625, priceUnit: 'KG', priceSuffix: 'KG', isActive: true, sortOrder: 3 },
  { id: 'meat-4', category: 'MEAT', name: 'Smoked Pork Belly', price: 425, priceUnit: 'KG', priceSuffix: 'KG', isActive: true, sortOrder: 4 },
  { id: 'meat-5', category: 'MEAT', name: 'Smoked Pork Rib', price: 425, priceUnit: 'RACK', priceSuffix: 'RACK', isActive: true, sortOrder: 5 },
  { id: 'meat-6', category: 'MEAT', name: 'Smoked Pulled Pork', price: 300, priceUnit: 'KG', priceSuffix: 'KG', isActive: true, sortOrder: 6 },

  // SIDES
  { id: 'sides-1', category: 'SIDES', name: 'Mac N Cheese', price: 450, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 1 },
  { id: 'sides-2', category: 'SIDES', name: 'BBQ Beans', price: 350, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 2 },
  { id: 'sides-3', category: 'SIDES', name: 'Corn Bread', price: 179, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 3 },
  { id: 'sides-4', category: 'SIDES', name: 'Potato Salad', price: 230, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 4 },
  { id: 'sides-5', category: 'SIDES', name: 'Cob Salad', price: 225, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 5 },
  { id: 'sides-6', category: 'SIDES', name: 'Coleslaw', price: 225, priceUnit: 'TRAY', priceSuffix: '', isActive: true, sortOrder: 6 },

  // SLIDERS
  { id: 'sliders-1', category: 'SLIDERS', name: 'Smoked Pulled Pork', price: 625, priceUnit: 'SLIDER_ORDER', priceSuffix: '', isActive: true, sortOrder: 1 },
  { id: 'sliders-2', category: 'SLIDERS', name: 'Smoked Brisket', price: 675, priceUnit: 'SLIDER_ORDER', priceSuffix: '', isActive: true, sortOrder: 2 },
  { id: 'sliders-3', category: 'SLIDERS', name: 'Chicken Salad', price: 600, priceUnit: 'SLIDER_ORDER', priceSuffix: '', isActive: true, sortOrder: 3 },
  { id: 'sliders-4', category: 'SLIDERS', name: 'Beef Burger', price: 875, priceUnit: 'SLIDER_ORDER', priceSuffix: '', isActive: true, sortOrder: 4 },
  { id: 'sliders-5', category: 'SLIDERS', name: 'Chicken Burger', price: 800, priceUnit: 'SLIDER_ORDER', priceSuffix: '', isActive: true, sortOrder: 5 },

  // OTHER
  { id: 'other-1', category: 'OTHER', name: 'Smoked Chicken Wings', price: 395, priceUnit: 'PC', priceSuffix: '/ 40 PC', isActive: true, sortOrder: 1 },
  { id: 'other-2', category: 'OTHER', name: 'Smoked Pork Belly Pinwheels', price: 410, priceUnit: 'KG', priceSuffix: '/KG', isActive: true, sortOrder: 2 },
  { id: 'other-3', category: 'OTHER', name: 'Chicken Fingers', price: 385, priceUnit: 'PC', priceSuffix: '/50 PC', isActive: true, sortOrder: 3 },
  { id: 'other-4', category: 'OTHER', name: 'Chickenwings', price: 375, priceUnit: 'PC', priceSuffix: '/40 PC', isActive: true, sortOrder: 4 },
];

export const categoryImages: Record<string, string> = {
  MEAT: `${import.meta.env.BASE_URL}assets/beef-ribs-smoke.png`,
  SIDES: `${import.meta.env.BASE_URL}assets/hero-bbq-spread.jpg`,
  SLIDERS: `${import.meta.env.BASE_URL}assets/pulled-pork-sliders.png`,
  OTHER: `${import.meta.env.BASE_URL}assets/bbq-wings-dark.png`,
};

export const categoryLabels: Record<string, { title: string; subtitle?: string }> = {
  MEAT: { title: 'MEAT' },
  SIDES: { title: 'SIDES', subtitle: 'PER TRAY (16–20 PAX)' },
  SLIDERS: { title: 'SLIDERS', subtitle: '25 SLIDERS PER ORDER' },
  OTHER: { title: 'OTHER' },
};

export const categoryOrder: string[] = ['MEAT', 'SIDES', 'SLIDERS', 'OTHER'];

export const eventTypeOptions = [
  'Corporate Event',
  'Wedding',
  'Birthday Party',
  'Private Party',
  'Other',
] as const;

export const serviceTypeOptions = [
  'Delivery (HK$150)',
  'Pickup — Free (Discovery Bay)',
] as const;

export const MIN_ORDER = 2000;
export const DELIVERY_FEE = 150;
export const LEAD_TIME_DAYS = 5;
