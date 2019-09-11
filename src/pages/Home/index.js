import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';

import { ProductList, Spinner } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

function Home({ cart, amount, addToCartRequest }) {
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState([]);
  const [loading, setLoading] = useState(true);

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

    addToCartRequest(product.id);
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

const mapStateToProps = state => ({
  cart: state.cart,
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
  loading: false,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
