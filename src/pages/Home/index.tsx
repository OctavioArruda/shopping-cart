import { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { getProducts } from '../../services/products';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount: CartItemsAmount, product: Product) => {
    const newSumAmount = { ...sumAmount };
    newSumAmount[product.id] = product.amount;

    return newSumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const products = await getProducts();

      const formattedProducts = products.map(product => {
        return {
          ...product,
          priceFormatted: formatPrice(product.price),
        };
      });

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number): void {
    addProduct(id);
  }

  return (
    <ProductList>
      {console.log(products)}
      {products.map((product: ProductFormatted, _: number) => {
        return (
          <li key={product.id}>
            <img src={product.image} alt={product.title}></img>
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type='button'
              data-testid='add-product-button'
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid='cart-product-quantity'>
                <MdAddShoppingCart size={16} color='#FFF' />
                {cartItemsAmount[product.id] || 0}
              </div>
              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        );
      })}
    </ProductList>
  );
};

export default Home;
