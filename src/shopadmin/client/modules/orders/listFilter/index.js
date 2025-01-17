import { connect } from 'react-redux';
import { fetchOrders, setFilter } from '../actions';
import { fetchSellers } from '../../products/actions';
import Filter from './components/fields';

const mapStateToProps = state => {
	return {
		isClosed: state.orders.filter.closed,
		isCancelled: state.orders.filter.cancelled,
		isDelivered: state.orders.filter.delivered,
		isPaid: state.orders.filter.paid,
		isHold: state.orders.filter.hold,
		isDraft: state.orders.filter.draft,
		seller: state.orders.filter.seller,
		sellers: state.products.sellers
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchSellers: () => {
			dispatch(fetchSellers());
		},
		setCancelled: value => {
			dispatch(setFilter({ cancelled: value }));
			dispatch(fetchOrders());
		},
		setDelivered: value => {
			dispatch(setFilter({ delivered: value }));
			dispatch(fetchOrders());
		},
		setPaid: value => {
			dispatch(setFilter({ paid: value }));
			dispatch(fetchOrders());
		},
		setHold: value => {
			dispatch(setFilter({ hold: value }));
			dispatch(fetchOrders());
		},
		setDraft: value => {
			dispatch(setFilter({ draft: value }));
			dispatch(fetchOrders());
		},
		setClosed: value => {
			dispatch(setFilter({ closed: value }));
			dispatch(fetchOrders());
		},
		setSeller: value => {
			dispatch(setFilter({ seller: value }));
			dispatch(fetchOrders());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filter);
