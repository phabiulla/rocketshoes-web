import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';

import { ProductList, Spinner } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

export default function Home() {
  const cart = useSelector(state => state.cart);
  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;

      return sumAmount;
    }, {})
  );
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart) {
      cart.map(product => {
        load[product.id] = product.load;
        return load;
      }, {});
    }

    setLoad(load);
  }, [cart, load]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  function handleAddProduct(product) {
    load[product.id] = true;

    setLoad(load);
    setProducts(products);

    dispatch(CartActions.addToCartRequest(product.id));
  }

  return (
    <>
      {loading ? (
        <Spinner color="#7159c1" size={36} />
      ) : (
        <ProductList>
          {products.map(product => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{product.priceFormatted}</span>

              <button type="button" onClick={() => handleAddProduct(product)}>
                <div>
                  {load[product.id] ? (
                    <Spinner color="#fff" size={14} />
                  ) : (
                    <MdAddShoppingCart size={16} color="#FFF" />
                  )}{' '}
                  {amount[product.id] || 0}
                </div>
                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          ))}
        </ProductList>
      )}
    </>
  );
}
