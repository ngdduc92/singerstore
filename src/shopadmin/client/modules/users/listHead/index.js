import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchUsers, deleteUsers, createUser, setFilter } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		search: state.users.filter.search,
		selectedCount: state.users.selected.length
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setSearch: (event, value) => {
			dispatch(setFilter({ search: value }));
			dispatch(fetchUsers());
		},
		onDelete: () => {
			dispatch(deleteUsers());
		},
		onCreate: () => {
			dispatch(createUser(ownProps.history));
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
