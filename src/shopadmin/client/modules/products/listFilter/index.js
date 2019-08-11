import { connect } from 'react-redux';
import { fetchProducts, setFilter, fetchSellers } from '../actions';
import Filter from './components/filter';

const mapStateToProps = state => {
	return {
		filter: state.products.filter,
		sellers: state.products.sellers
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchSellers: () => {
			dispatch(fetchSellers());
		},
		setEnabled: value => {
			dispatch(setFilter({ enabled: value }));
			dispatch(fetchProducts());
		},
		setDiscontinued: value => {
			dispatch(setFilter({ discontinued: value }));
			dispatch(fetchProducts());
		},
		setOnSale: value => {
			dispatch(setFilter({ onSale: value }));
			dispatch(fetchProducts());
		},
		setStock: value => {
			dispatch(setFilter({ stockStatus: value }));
			dispatch(fetchProducts());
		},
		setSeller: value => {
			dispatch(setFilter({ seller: value }));
			dispatch(fetchProducts());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filter);
