import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	fetchDiscounts,
	deleteDiscounts,
	createDiscount,
	setFilter
} from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		search: state.discounts.filter.search,
		selectedCount: state.discounts.selected.length
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setSearch: (event, value) => {
			dispatch(setFilter({ search: value }));
			dispatch(fetchDiscounts());
		},
		onDelete: () => {
			dispatch(deleteDiscounts());
		},
		onCreate: () => {
			dispatch(createDiscount(ownProps.history));
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
