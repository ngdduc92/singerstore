import React from 'react';
import messages from 'lib/text';
import DiscountCreateGeneral from './general';

class DiscountCreateContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.fetchData();
	}

	componentWillUnmount() {
		this.props.eraseData();
	}

	render() {
		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.discounts_titleCreate}
				</div>
				<DiscountCreateGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { cancelDiscountCreate, fetchDiscountTypes } from '../actions';
import { fetchCategoriesIfNeeded } from 'modules/productCategories/actions';

const mapStateToProps = (state, ownProps) => {
	return {
		discount: state.discounts.createDiscount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchData: () => {
			dispatch(fetchCategoriesIfNeeded());
		},
		eraseData: () => {
			dispatch(cancelDiscountCreate());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(DiscountCreateContainer)
);
