import React from 'react';
import MenuItem from 'material-ui/MenuItem';

export const types = {
	CART_DISCOUNT: 'cart',
	CART_PERCENT_DISCOUNT: 'cart_percent',
	PRODUCT_DISCOUNT: 'product',
	PRODUCT_PERCENT_DISCOUNT: 'product_percent',
	FREE_SHIPPING: 'free_shipping'
};

export const types_array = [
	{ label: 'Cart Discount', type: types.CART_DISCOUNT },
	{ label: 'Cart % Discount', type: types.CART_PERCENT_DISCOUNT },
	{ label: 'Product Discount', type: types.PRODUCT_DISCOUNT },
	{ label: 'Product % Discount', type: types.PRODUCT_PERCENT_DISCOUNT },
	{ label: 'Free Shipping', type: types.FREE_SHIPPING }
];

const getTypeMenuItems = () => {
	let typeMenuItems = [];
	const types_arr = types_array;
	for (const type of types_arr) {
		typeMenuItems.push(
			<MenuItem value={type.type} key={type.type} primaryText={type.label} />
		);
	}
	return typeMenuItems;
};

export const TYPE_MENU_ITEMS = getTypeMenuItems();