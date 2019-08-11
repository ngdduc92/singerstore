import React from 'react';
import messages from 'lib/text';
import DiscountGeneral from './general';

class DiscountEditContainer extends React.Component {
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
					{messages.discounts_titleEdit}
				</div>
				<DiscountGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchDiscount, cancelDiscountEdit } from '../actions';
import { fetchCategoriesIfNeeded } from 'modules/productCategories/actions';

const mapStateToProps = (state, ownProps) => {
	return {
		discount: state.discounts.editDiscount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchData: () => {
			const { discountId } = ownProps.match.params;
			dispatch(fetchDiscount(discountId));
			dispatch(fetchCategoriesIfNeeded());
		},
		eraseData: () => {
			dispatch(cancelDiscountEdit());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(DiscountEditContainer)
);
