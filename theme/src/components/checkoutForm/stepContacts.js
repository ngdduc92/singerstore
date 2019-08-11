import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { themeSettings, text } from '../../lib/settings';
import { formatCurrency } from '../../lib/helper';
import InputField from '../inputField';
import validation from '../validation';
import ReadOnlyField from '../readOnlyField';

class CheckoutStepContacts extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			handleSubmit,
			pristine,
			invalid,
			valid,
			reset,
			submitting,
			loadingShippingMethods,
			loadingPaymentMethods,
			initialValues,
			settings,
			saveShippingLocation,
			saveShippingMethod,
			savePaymentMethod,
			paymentMethods,
			shippingMethods,
			inputClassName,
			buttonClassName,
			editButtonClassName,
			onEdit,
			isReadOnly,
			title
		} = this.props;

		if (isReadOnly) {
			return (
				<div className="checkout-step">
					<h1>
						<span>1</span>
						{title}
					</h1>
					<ReadOnlyField
						name={text.shippingMethod}
						value={initialValues.shipping_method}
					/>
					<ReadOnlyField
						name={text.paymentMethod}
						value={initialValues.payment_method}
					/>

					<div className="checkout-button-wrap">
						<button
							type="button"
							onClick={onEdit}
							className={editButtonClassName}
						>
							{text.edit}
						</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="checkout-step">
					<h1>
						<span>1</span>
						{title}
					</h1>
					<form onSubmit={handleSubmit}>
						<h2>
							{text.shippingMethods}{' '}
							{loadingShippingMethods && <small>{text.loading}</small>}
						</h2>
						<div className="shipping-methods">
							{shippingMethods
								? shippingMethods.map((method, index) => (
										<label
											key={index}
											className={
												'shipping-method' +
												(method.id === initialValues.shipping_method_id
													? ' active'
													: '')
											}
										>
											<Field
												name="shipping_method_id"
												component="input"
												type="radio"
												value={method.id}
												onClick={() => saveShippingMethod(method.id)}
											/>
											<div>
												<div className="shipping-method-name">
													{method.name}
												</div>
												<div className="shipping-method-description">
													{method.description}
												</div>
											</div>
											<span className="shipping-method-rate">
												{formatCurrency(method.price, settings)}
											</span>
										</label>
								  ))
								: null}
						</div>

						<h2>
							{text.paymentMethods}{' '}
							{loadingPaymentMethods && <small>{text.loading}</small>}
						</h2>
						<div className="payment-methods">
							{paymentMethods
								? paymentMethods.map((method, index) => (
										<label
											key={index}
											className={
												'payment-method' +
												(method.id === initialValues.payment_method_id
													? ' active'
													: '')
											}
										>
											<Field
												name="payment_method_id"
												validate={[validation.required]}
												component="input"
												type="radio"
												value={method.id}
												onClick={() => savePaymentMethod(method.id)}
											/>
											<div>
												<div className="payment-method-name">{method.name}</div>
												<div className="payment-method-description">
													{method.description}
												</div>
											</div>
											<span className="payment-method-logo" />
										</label>
								  ))
								: null}
						</div>

						<div className="checkout-button-wrap">
							<button
								type="submit"
								disabled={invalid}
								className={buttonClassName}
							>
								{text.next}
							</button>
						</div>
					</form>
				</div>
			);
		}
	}
}

export default reduxForm({
	form: 'CheckoutStepContacts',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true
})(CheckoutStepContacts);
