export type MenuCategory = 'MEAT' | 'SIDES' | 'SLIDERS' | 'OTHER';

export type PriceUnit = 'KG' | 'RACK' | 'PC' | 'TRAY' | 'SLIDER_ORDER';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description?: string;
  price: number;
  priceUnit: PriceUnit;
  priceSuffix: string;
  image?: string | null;
  minOrder?: number;
  isActive: boolean;
  sortOrder: number;
}

export interface SelectedItem {
  menuItem: MenuItem;
  quantity: number;
}

export type EventType = 'Corporate Event' | 'Wedding' | 'Birthday Party' | 'Private Party' | 'Other';

export type ServiceType = 'Delivery (HK$150)' | 'Pickup — Free (Discovery Bay)';

export interface EventDetails {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: EventType | '';
  guestCount: number;
  serviceType: ServiceType | '';
  deliveryAddress: string;
  notes: string;
}

export type ConfiguratorStep = 1 | 2 | 3;

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
