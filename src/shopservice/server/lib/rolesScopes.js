import scopes from './scopes';
import roles from './roles';
export default [
	{
		role: roles.OWNER,
		scopes: [
			scopes.READ_PAGE,
			scopes.WRITE_PAGE,
			scopes.DELETE_PAGE,
			scopes.LIST_API_KEY,
			scopes.READ_API_KEY,
			scopes.WRITE_API_KEY,
			scopes.DELETE_API_KEY,
			scopes.READ_SETTINGS,
			scopes.LIST_TENANT,
			scopes.READ_TENANT,
			scopes.WRITE_TENANT,
			scopes.DELETE_TENANT,
			scopes.READ_THEME_SETTINGS,
			scopes.WRITE_THEME_SETTINGS,
			scopes.READ_USER,
			scopes.WRITE_USER,
			scopes.READ_EMAIL_SETTINGS,
			scopes.READ_SMTP,
			scopes.WRITE_SMTP,
			scopes.READ_EMAIL_TEMPLATE,
			scopes.WRITE_EMAIL_TEMPLATE
		]
	},
	{
		role: roles.ADMINISTRATOR,
		scopes: [
			scopes.READ_CART,
			scopes.WRITE_CART,
			scopes.DELETE_CART,
			scopes.LIST_CUSTOMER_GROUP,
			scopes.READ_CUSTOMER_GROUP,
			scopes.WRITE_CUSTOMER_GROUP,
			scopes.DELETE_CUSTOMER_GROUP,
			scopes.LIST_CUSTOMER,
			scopes.READ_CUSTOMER,
			scopes.WRITE_CUSTOMER,
			scopes.DELETE_CUSTOMER,
			scopes.LIST_DISCOUNT,
			scopes.READ_DISCOUNT,
			scopes.WRITE_DISCOUNT,
			scopes.DELETE_DISCOUNT,
			scopes.LIST_ORDER,
			scopes.READ_ORDER,
			scopes.WRITE_ORDER,
			scopes.DELETE_ORDER,
			scopes.LIST_ORDER_STATUS,
			scopes.READ_ORDER_STATUS,
			scopes.WRITE_ORDER_STATUS,
			scopes.DELETE_ORDER_STATUS,
			scopes.READ_PAGE_SETTINGS,
			scopes.LIST_PAGE,
			scopes.READ_PAGE,
			scopes.WRITE_PAGE,
			scopes.DELETE_PAGE,
			scopes.READ_PAYMENT_GATEWAY,
			scopes.WRITE_PAYMENT_GATEWAY,
			scopes.LIST_PAYMENT_METHOD,
			scopes.READ_PAYMENT_METHOD,
			scopes.WRITE_PAYMENT_METHOD,
			scopes.DELETE_PAYMENT_METHOD,
			scopes.LIST_PRODUCT_CATEGORY,
			scopes.READ_PRODUCT_CATEGORY,
			scopes.WRITE_PRODUCT_CATEGORY,
			scopes.DELETE_PRODUCT_CATEGORY,
			scopes.LIST_PRODUCT,
			scopes.READ_PRODUCT,
			scopes.WRITE_PRODUCT,
			scopes.DELETE_PRODUCT,
			scopes.LIST_REDIRECT,
			scopes.READ_REDIRECT,
			scopes.WRITE_REDIRECT,
			scopes.DELETE_REDIRECT,
			scopes.READ_SETTINGS,
			scopes.READ_GENERAL_SETTINGS,
			scopes.WRITE_GENERAL_SETTINGS,
			scopes.LIST_SHIPPING_METHOD,
			scopes.READ_SHIPPING_METHOD,
			scopes.WRITE_SHIPPING_METHOD,
			scopes.DELETE_SHIPPING_METHOD,
			scopes.READ_TENANT,
			scopes.WRITE_TENANT,
			scopes.READ_THEME_SETTINGS,
			scopes.WRITE_THEME_SETTINGS,
			scopes.LIST_USER,
			scopes.READ_USER,
			scopes.WRITE_USER,
			scopes.DELETE_USER,
			scopes.LIST_WEBHOOK,
			scopes.READ_WEBHOOK,
			scopes.WRITE_WEBHOOK,
			scopes.DELETE_WEBHOOK,
			scopes.READ_EMAIL_SETTINGS,
			scopes.READ_EMAIL_TEMPLATE,
			scopes.WRITE_EMAIL_TEMPLATE,
			scopes.PLACE_ORDER
		]
	},
	{
		role: roles.SELLER,
		scopes: [
			scopes.READ_CART,
			scopes.WRITE_CART,
			scopes.DELETE_CART,
			scopes.LIST_CUSTOMER_GROUP,
			scopes.LIST_CUSTOMER,
			scopes.READ_CUSTOMER,
			scopes.READ_DISCOUNT,
			scopes.LIST_ORDER,
			scopes.READ_ORDER,
			scopes.LIST_ORDER_STATUS,
			scopes.LIST_PAGE,
			scopes.READ_PAGE,
			scopes.READ_PAYMENT_GATEWAY,
			scopes.LIST_PAYMENT_METHOD,
			scopes.READ_PAYMENT_METHOD,
			scopes.LIST_PRODUCT_CATEGORY,
			scopes.LIST_PRODUCT,
			scopes.READ_PRODUCT,
			scopes.WRITE_PRODUCT,
			scopes.READ_GENERAL_SETTINGS,
			scopes.LIST_SHIPPING_METHOD,
			scopes.READ_SHIPPING_METHOD,
			scopes.READ_USER,
			scopes.WRITE_USER,
			scopes.PLACE_ORDER
		]
	},
	{
		role: roles.CUSTOMER,
		scopes: [
			scopes.READ_CART,
			scopes.WRITE_CART,
			scopes.DELETE_CART,
			scopes.READ_DISCOUNT,
			scopes.LIST_PAGE,
			scopes.READ_PAGE,
			scopes.READ_PAYMENT_GATEWAY,
			scopes.LIST_PAYMENT_METHOD,
			scopes.READ_PAYMENT_METHOD,
			scopes.LIST_PRODUCT_CATEGORY,
			scopes.LIST_PRODUCT,
			scopes.READ_PRODUCT,
			scopes.READ_GENERAL_SETTINGS,
			scopes.LIST_SHIPPING_METHOD,
			scopes.READ_SHIPPING_METHOD,
			scopes.READ_USER,
			scopes.WRITE_USER,
			scopes.PLACE_ORDER
		]
	}
];
