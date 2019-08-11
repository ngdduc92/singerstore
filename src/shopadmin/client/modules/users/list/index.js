import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	fetchUsers,
	fetchMoreUsers,
	selectUser,
	deselectUser,
	selectAllUser,
	deselectAllUser
} from '../actions';
import List from './components/list';

const mapStateToProps = (state, ownProps) => {
	return {
		settings: state.settings.settings,
		items: state.users.items,
		selected: state.users.selected,
		loadingItems: state.users.loadingItems,
		hasMore: state.users.hasMore,
		totalCount: state.users.totalCount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			dispatch(fetchUsers());
		},
		onSelect: (id, checked) => {
			if (checked) {
				dispatch(selectUser(id));
			} else {
				dispatch(deselectUser(id));
			}
		},
		onSelectAll: checked => {
			if (checked) {
				dispatch(selectAllUser());
			} else {
				dispatch(deselectAllUser());
			}
		},
		loadMore: () => {
			dispatch(fetchMoreUsers());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(List)
);
