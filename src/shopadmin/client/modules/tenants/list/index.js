import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	fetchTenants,
	fetchMoreTenants,
	selectTenant,
	deselectTenant,
	selectAllTenant,
	deselectAllTenant
} from '../actions';
import List from './components/list';

const mapStateToProps = (state, ownProps) => {
	return {
		settings: state.settings.settings,
		items: state.tenants.items,
		selected: state.tenants.selected,
		loadingItems: state.tenants.loadingItems,
		hasMore: state.tenants.hasMore,
		totalCount: state.tenants.totalCount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			dispatch(fetchTenants());
		},
		onSelect: (id, checked) => {
			if (checked) {
				dispatch(selectTenant(id));
			} else {
				dispatch(deselectTenant(id));
			}
		},
		onSelectAll: checked => {
			if (checked) {
				dispatch(selectAllTenant());
			} else {
				dispatch(deselectAllTenant());
			}
		},
		loadMore: () => {
			dispatch(fetchMoreTenants());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(List)
);
