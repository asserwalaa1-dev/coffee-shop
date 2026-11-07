export interface BeanVariant {
  id: number;
  coffee_bean_id: number;
  weight: number;
  price: number;
}

export interface CoffeeBean {
  id: number;
  name: string;
  origin: string;
  roast_level: string;
  description: string;
  image_url: string;
  variants: BeanVariant[];
}
