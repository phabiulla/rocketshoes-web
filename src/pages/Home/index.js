import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';

import { ProductList, Spinner } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
    loading: true,
  };

  async componentDidMount() {
    const response = await api.get('products');
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
      loadingAddCart: false,
    }));

    this.setState({ products: data, loading: false });
  }

  handleAddProduct = product => {
    const items = this.state.products;
    const index = this.state.products.indexOf(product);
    items[index].loadingAddCart = true;

    this.setState({ products: items });

    const { addToCartRequest } = this.props;
    addToCartRequest(product.id);
  };

  render() {
    const { products, loading } = this.state;
    const { amount } = this.props;

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

                <button
                  type="button"
                  onClick={() => this.handleAddProduct(product)}
                >
                  <div>
                    {product.loadingAddCart ? (
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
}

const mapStateToProps = state => ({
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
