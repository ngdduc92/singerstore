import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import productCategories from 'modules/productCategories/reducer';
import products from 'modules/products/reducer';
import customerGroups from 'modules/customerGroups/reducer';
import customers from 'modules/customers/reducer';
import orders from 'modules/orders/reducer';
import orderStatuses from 'modules/orderStatuses/reducer';
import pages from 'modules/pages/reducer';
import settings from 'modules/settings/reducer';
import tenants from 'modules/tenants/reducer';
import users from 'modules/users/reducer';
import discounts from 'modules/discounts/reducer';
import resetPassword from 'modules/resetPassword/reducer';

export default combineReducers({
	form: formReducer,
	productCategories,
	products,
	settings,
	customerGroups,
	customers,
	orders,
	orderStatuses,
	pages,
	tenants,
	users,
	discounts,
	resetPassword
});
