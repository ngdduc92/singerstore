import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { NavLink } from 'react-router-dom';
import { themeSettings, text, tenantUrlName, locale } from '../lib/settings';
import * as helper from '../lib/helper';

const SummaryItem = ({ settings, item, updateCartItemQuantity }) => {
	const thumbnail = helper.getThumbnailUrl(
		item.image_url,
		themeSettings.cartThumbnailWidth
	);
	const qtyOptions = [];
	const maxQty = item.stock_backorder
		? themeSettings.maxCartItemQty
		: item.stock_quantity >= themeSettings.maxCartItemQty
		? themeSettings.maxCartItemQty
		: item.stock_quantity;

	for (let i = 0; i <= maxQty; i++) {
		const optionText = i === 0 ? text.remove : i;
		qtyOptions.push(
			<option key={i} value={i}>
				{optionText}
			</option>
		);
	}

	return (
		<div className="columns is-mobile">
			<div className="column is-3">
				<div className="image">
					<NavLink to={`/${tenantUrlName}/${locale}${item.path}`}>
						<img
							className="product-image"
							src={thumbnail}
							alt={item.name}
							title={item.name}
						/>
					</NavLink>
				</div>
			</div>
			<div className="column">
				<div>
					<NavLink to={`/${tenantUrlName}/${locale}${item.path}`}>
						{item.name}
					</NavLink>
				</div>
				{item.variant_name.length > 0 && (
					<div className="cart-option-name">{item.variant_name}</div>
				)}
				<div className="qty">
					<span>{text.qty}:</span>
					<span className="select is-small">
						<select
							onChange={e => {
								updateCartItemQuantity(item.id, e.target.value);
							}}
							value={item.quantity}
						>
							{qtyOptions}
						</select>
					</span>
				</div>
			</div>
			<div className="column is-3 has-text-right price">
				{helper.formatCurrency(item.price_total, settings)}
			</div>
		</div>
	);
};

SummaryItem.propTypes = {
	settings: PropTypes.shape({}).isRequired,
	item: PropTypes.shape({}).isRequired,
	updateCartItemQuantity: PropTypes.func.isRequired
};

const DiscountField = field => (
	<div className={field.className}>
		<label htmlFor={field.id}>{field.label}</label>
		<label>{field.error && <span className="error">{field.error}</span>}</label>
		<div className="discount-code-apply-btn">
			<input
				{...field.input}
				placeholder={field.placeholder}
				type={field.type}
				id={field.id}
				className={field.meta.touched && field.error ? 'invalid' : ''}
			/>
			<button
				className={field.buttonClassName}
				onClick={field.onButtonClick}
				disabled={field.invalidDiscount}
			>
				{field.buttonLabel}
			</button>
		</div>
	</div>
);

class OrderSummary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			discount: '',
			invalidDiscount: true
		};
	}

	handleChangeDiscount = event => {
		this.setState({
			discount: event.target.value,
			invalidDiscount: false
		});
		if (event.target.value === '') {
			this.props.applyDiscount(null);
			this.setState({
				invalidDiscount: true
			});
		}
	};

	handleApplyDiscount = event => {
		event.preventDefault();
		this.setState({
			invalidDiscount: true
		});
		if (this.state.discount) {
			this.props.applyDiscount(this.state.discount);
		}
	};

	render() {
		const { invalidDiscount } = this.state;

		const {
			updateCartItemQuantity,
			state: { cart, settings }
		} = this.props;

		const { discountError } = this.props.state;

		const {
			checkoutInputClass = 'checkout-field',
			checkoutButtonClass = 'checkout-button'
		} = themeSettings;

		if (cart && cart.items && cart.items.length > 0) {
			const items = cart.items.map(item => (
				<SummaryItem
					key={item.id}
					item={item}
					updateCartItemQuantity={updateCartItemQuantity}
					settings={settings}
				/>
			));

			return (
				<div
					className="checkout-box content is-small"
					style={{ paddingBottom: 0 }}
				>
					<div className="title is-4">{text.orderSummary}</div>
					<hr className="separator" />
					{items}
					<hr className="separator" />
					<h2>{text.discountCode}</h2>
					<div className="discount-code">
						<Field
							name="coupon.code"
							placeholder={cart.coupon.code}
							id="discount"
							label={text.discountWarning}
							component={DiscountField}
							type="text"
							className={checkoutInputClass}
							onChange={this.handleChangeDiscount}
							error={discountError}
							onButtonClick={this.handleApplyDiscount}
							invalidDiscount={invalidDiscount}
							buttonClassName={checkoutButtonClass}
							buttonLabel={text.apply}
						/>
					</div>
					<div className="columns is-mobile is-gapless is-multiline summary-block">
						<div className="column is-7">{text.subtotal}</div>
						<div className="column is-5 has-text-right price">
							{helper.formatCurrency(cart.subtotal, settings)}
						</div>
						<div className="column is-7">{text.shipping}</div>
						<div className="column is-5 has-text-right price">
							{helper.formatCurrency(cart.shipping_total, settings)}
						</div>

						<div className="column is-7">{text.discount}</div>
						<div className="column is-5 has-text-right price">
							{helper.formatCurrency(cart.discount_total, settings)}
						</div>

						<div className="column is-12">
							<hr className="separator" />
						</div>
						<div className="column is-6 total-text">{text.grandTotal}</div>
						<div className="column is-6 total-price">
							{helper.formatCurrency(cart.grand_total, settings)}
						</div>
					</div>
				</div>
			);
		}
		return null;
	}
}

OrderSummary.propTypes = {
	updateCartItemQuantity: PropTypes.func.isRequired,
	state: PropTypes.shape({
		cart: PropTypes.shape({}),
		settings: PropTypes.shape({}).isRequired
	}).isRequired
};

export default reduxForm({
	form: 'OrderSummary',
	enableReinitialize: true
})(OrderSummary);
