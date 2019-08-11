import crypto from 'crypto';
import settings from '../../server/settings';

export const removeTenant = () => {
	localStorage.removeItem('tenant_url_name');
	localStorage.removeItem('tenant_id');
};

export const saveTenant = (data) => {
	localStorage.setItem('tenant_url_name', data.tenant_url_name);
	localStorage.setItem('tenant_id', data.tenant_id);
};

export const parseToken = token => {
	try {
		const payload = token.split('.')[1];
		const tokenData = JSON.parse(atob(payload));
		return tokenData;
	} catch (e) {
		return null;
	}
};

export const removeLoginItems = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('email');
	localStorage.removeItem('token_exp');
	localStorage.removeItem('role');
	localStorage.removeItem('user_id');
};

export const saveLoginItems = data => {
	localStorage.setItem('token', data.token);
	localStorage.setItem('email', data.email);
	localStorage.setItem('token_exp', data.expiration_date);
	localStorage.setItem('role', data.role);
	localStorage.setItem('user_id', data.user_id);
};

export const isCurrentTokenValid = () => {
	const expiration_date = localStorage.getItem('token_exp');
	return (
		localStorage.getItem('token') &&
		expiration_date &&
		expiration_date > Date.now()
	);
}

export const encrypt = (text) => {
	if(text) {
		let iv = crypto.randomBytes(16);
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(settings.cryptoSecretKey), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return iv.toString('hex') + ':' + encrypted.toString('hex');
	} else {
		return null;
	}
}

export const decrypt = (text) => {
	if(text) {
		let textParts = text.split(':');
		const iv = Buffer.from(textParts.shift(), 'hex');
		const encryptedText = Buffer.from(textParts.join(':'), 'hex');
		const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(settings.cryptoSecretKey), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	} else {
		return null;
	}
}

const getVariantFromProduct = (product, variantId) => {
	if (product.variants && product.variants.length > 0) {
		return product.variants.find(
			variant => variant.id.toString() === variantId.toString()
		);
	} else {
		return null;
	}
};

const fillCartItemWithProductData = (products, cartItem) => {
	const product = products.find(p => p.id === cartItem.product_id);
	if (product) {
		cartItem.image_url =
			product.images && product.images.length > 0
				? product.images[0].url
				: null;
		cartItem.path = product.path;
		cartItem.stock_backorder = product.stock_backorder;
		cartItem.stock_preorder = product.stock_preorder;
		if (cartItem.variant_id && cartItem.variant_id.length > 0) {
			const variant = getVariantFromProduct(product, cartItem.variant_id);
			cartItem.stock_quantity = variant ? variant.stock_quantity : 0;
		} else {
			cartItem.stock_quantity = product.stock_quantity;
		}
	}
	return cartItem;
};

export const fillCartItems = (api, cartResponse) => {
	let cart = cartResponse.json;
	if (cart && cart.items && cart.items.length > 0) {
		const productIds = cart.items.map(item => item.product_id);
		return api.public.products
			.list({
				ids: productIds,
				fields:
					'images,enabled,stock_quantity,variants,path,stock_backorder,stock_preorder'
			})
			.then(({ status, json }) => {
				const newCartItem = cart.items.map(cartItem =>
					fillCartItemWithProductData(json.data, cartItem)
				);
				cartResponse.json.items = newCartItem;
				return cartResponse;
			});
	} else {
		return Promise.resolve(cartResponse);
	}
};

export default {
	removeTenant: removeTenant,
	saveTenant: saveTenant,
	parseToken: parseToken,
	removeLoginItems: removeLoginItems,
	saveLoginItems: saveLoginItems,
	isCurrentTokenValid: isCurrentTokenValid,
	encrypt: encrypt,
	decrypt: decrypt,
	fillCartItems: fillCartItems
};
