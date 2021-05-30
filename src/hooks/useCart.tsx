import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { getProduct } from '../services/products';
import { getStock } from '../services/stocks';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  const addProduct = async (productId: number): Promise<void> => {
    try {
      const addedProduct: Product = await getProduct(productId);
      const cartContainsProduct = cart.includes(addedProduct);

      if (cartContainsProduct) {
        updateProductAmount({ productId, amount: addedProduct.amount + 1 });
        return;
      }

      const productStock: Stock = await getStock(productId);

      if (productStock.amount === 0) throw new Error('Quantidade solicitada fora de estoque');

      setCart([...cart, addedProduct]);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({ productId, amount }: UpdateProductAmount) => {
    try {
      const addedProduct: Product = await getProduct(productId);
      const productStock: Stock = await getStock(productId);

      const updatedCart = cart.map(product => {
        if (product.id === addedProduct.id) {
          if (amount > productStock.amount) {
            throw new Error('Quantidade solicitada fora de estoque');
          }

          product.amount = amount;
        }

        return product;
      });

      setCart(updatedCart);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
