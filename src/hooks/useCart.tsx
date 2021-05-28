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

  const addProduct = async (productId: number) => {
    try {
      const addedProduct: Product = await getProduct(productId);

      const cartContainsProduct = cart.includes(addedProduct);

      if (cartContainsProduct) {
        const productStock: Stock = await getStock(productId);

        const updatedCart = cart.map(product => {
          if (product.id === addedProduct.id) {
            const updatedProductAmount = product.amount + 1;
            if (updatedProductAmount > productStock.amount) {
              throw new Error('Quantidade solicitada fora de estoque');
            }

            product.amount = updatedProductAmount;
          }

          return product;
        });

        setCart(updatedCart);
      } else {
        setCart([...cart, addedProduct]);
      }
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
      // TODO
    } catch {
      // TODO
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
