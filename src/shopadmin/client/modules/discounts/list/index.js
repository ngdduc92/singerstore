import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	fetchDiscounts,
	fetchMoreDiscounts,
	selectDiscount,
	deselectDiscount,
	selectAllDiscount,
	deselectAllDiscount
} from '../actions';
import List from './components/list';

const mapStateToProps = (state, ownProps) => {
	return {
		settings: state.settings.settings,
		items: state.discounts.items,
		selected: state.discounts.selected,
		loadingItems: state.discounts.loadingItems,
		hasMore: state.discounts.hasMore,
		totalCount: state.discounts.totalCount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			dispatch(fetchDiscounts());
		},
		onSelect: (id, checked) => {
			if (checked) {
				dispatch(selectDiscount(id));
			} else {
				dispatch(deselectDiscount(id));
			}
		},
		onSelectAll: checked => {
			if (checked) {
				dispatch(selectAllDiscount());
			} else {
				dispatch(deselectAllDiscount());
			}
		},
		loadMore: () => {
			dispatch(fetchMoreDiscounts());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(List)
);
