import { Stock } from '../types';
import { api } from './api';

export const getStock = async (productId: number): Promise<Stock> =>
  await api(`stock/${productId}`).then(response => response.data);
