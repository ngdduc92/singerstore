import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { TextField, SelectField, DatePicker } from 'redux-form-material-ui';
import messages from 'lib/text';
import { TYPE_MENU_ITEMS } from 'lib/discountTypes';
import style from './style.css';
import ProductCategoryMultiSelect from 'modules/products/edit/additional/components/productCategoryMultiSelect';
import ProductsArray from 'modules/discounts/create/general/components/productsArray';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { CustomToggle } from 'modules/shared/form';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const validate = values => {
	const errors = {};
	const requiredFields = ['code', 'type'];

	requiredFields.map(field => {
		if (values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

class DiscountGeneralForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {
			handleSubmit,
			pristine,
			reset,
			submitting,
			initialValues,
			settings,
			categories
		} = this.props;

		if (initialValues) {
			return (
				<form onSubmit={handleSubmit}>
					<Paper className="paper-box" zDepth={1}>
						<div className={style.innerBox}>
							<Field
								name="code"
								component={TextField}
								floatingLabelText={messages.discounts_code + ' *'}
								fullWidth={true}
							/>
							<Field
								name="description"
								component={TextField}
								floatingLabelText={messages.discounts_description}
								fullWidth={true}
							/>
							<Field
								component={SelectField}
								name="type"
								floatingLabelText={messages.discounts_type + ' *'}
								fullWidth={true}
								autoWidth={true}
							>
								{TYPE_MENU_ITEMS}
							</Field>
							<Field
								name="amount"
								component={TextField}
								floatingLabelText={messages.discounts_amount}
								fullWidth={true}
							/>
							<div className="row">
								<div className="col-xs-6">
									<Field
										name="date_from"
										component={DatePicker}
										textFieldStyle={{ width: '100%' }}
										format={(value, name) => (value ? new Date(value) : null)}
										floatingLabelText={messages.discounts_date_from}
									/>
								</div>
								<div className="col-xs-6">
									<Field
										name="date_to"
										component={DatePicker}
										textFieldStyle={{ width: '100%' }}
										format={(value, name) => (value ? new Date(value) : null)}
										floatingLabelText={messages.discounts_date_to}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-xs-6">
									<Field
										name="quantity_min"
										component={TextField}
										floatingLabelText={messages.discounts_quantity_min}
										fullWidth={true}
									/>
								</div>
								<div className="col-xs-6">
									<Field
										name="quantity_max"
										component={TextField}
										floatingLabelText={messages.discounts_quantity_max}
										fullWidth={true}
									/>
								</div>
							</div>
							<Field
								name="quantity"
								component={TextField}
								floatingLabelText={messages.discounts_quantity}
								fullWidth={true}
							/>
							<div className={'row middle-xs ' + style.lineBottom}>
								<div className={'col-xs-12 col-sm-4 ' + style.nopadding}>
									{messages.discounts_categories}
								</div>
								<div className="col-xs-12 col-sm-8">
									<FieldArray
										name="category_ids"
										component={ProductCategoryMultiSelect}
										categories={categories}
									/>
								</div>
							</div>
							<div className={'col-xs-12 col-sm-4 ' + style.nopadding}>
								{messages.discounts_products}
							</div>
							<FieldArray
								name="product_ids"
								component={ProductsArray}
								settings={settings}
							/>
							<div className={'row middle-xs ' + style.lineTop}>
								<Field
									component={CustomToggle}
									name="enabled"
									label={messages.enabled}
									style={{ paddingTop: 16, paddingBottom: 16 }}
								/>
							</div>
						</div>
						<div
							className={
								'buttons-box ' +
								(pristine ? 'buttons-box-pristine' : 'buttons-box-show')
							}
						>
							<FlatButton
								label={messages.cancel}
								className={style.button}
								onClick={reset}
								disabled={pristine || submitting}
							/>
							<RaisedButton
								type="submit"
								label={messages.save}
								primary={true}
								className={style.button}
								disabled={
									!userScopes.includes(scopes.WRITE_DISCOUNT) ||
									pristine ||
									submitting
								}
							/>
						</div>
					</Paper>
				</form>
			);
		} else {
			return null;
		}
	}
}

export default reduxForm({
	form: 'DiscountGeneralForm',
	validate,
	enableReinitialize: true
})(DiscountGeneralForm);
