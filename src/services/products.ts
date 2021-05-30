import { Product } from '../types';
import { api } from './api';

export const getProducts = async (): Promise<Product[]> =>
  await api('products').then(response => response.data);

export const getProduct = async (productId: number): Promise<Product> =>
  await api(`products/${productId}`).then(response => response.data);
