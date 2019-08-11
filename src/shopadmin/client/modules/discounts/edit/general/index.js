import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateDiscount } from '../../actions';
import DiscountGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.discounts.editDiscount,
		categories: state.productCategories.items,
		settings: state.settings.settings
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateDiscount({
					id: values.id,
					code: values.code,
					description: values.description,
					type: values.type,
					amount: values.amount,
					date_from: values.date_from,
					date_to: values.date_to,
					quantity_min: values.quantity_min,
					quantity_max: values.quantity_max,
					quantity: values.quantity,
					category_ids: values.category_ids,
					product_ids: values.product_ids,
					enabled: values.enabled
				})
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(DiscountGeneralForm)
);
