import messages from './text';

export const formatNumber = (number, settings) => {
	const x = 3;
	const floatNumber = parseFloat(number || 0) || 0;

	const re =
		'\\d(?=(\\d{' +
		x +
		'})+' +
		(settings.decimal_number > 0 ? '\\D' : '$') +
		')';

	let num = floatNumber.toFixed(Math.max(0, ~~settings.decimal_number));

	return (settings.decimal_separator
		? num.replace('.', settings.decimal_separator)
		: num
	).replace(new RegExp(re, 'g'), '$&' + settings.thousand_separator);
};

const amountPattern = '{amount}';
export const formatCurrency = (number = 0, settings) => {
	return settings.currency_format.replace(
		amountPattern,
		formatNumber(number, settings)
	);
};

export const formatFileSize = (bytes = 0) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) {
		return 'n/a';
	} else {
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
		if (i === 0) {
			return `${bytes} ${sizes[i]}`;
		} else {
			return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
		}
	}
};

export const getThumbnailUrl = (originalUrl, width) => {
	if (originalUrl && originalUrl.length > 0) {
		const pos = originalUrl.lastIndexOf('/');
		const thumbnailUrl =
			originalUrl.substring(0, pos) +
			`/${width}/` +
			originalUrl.substring(pos + 1);
		return thumbnailUrl;
	} else {
		return '';
	}
};

export const getOrderFieldLabelByKey = key => {
	switch (key) {
		case 'full_name':
			return messages.fullName;
		case 'address1':
			return messages.address1;
		case 'address2':
			return messages.address2;
		case 'postal_code':
			return messages.postal_code;
		case 'phone':
			return messages.phone;
		case 'company':
			return messages.company;
		case 'mobile':
			return messages.mobile;
		case 'city':
			return messages.city;
		case 'comments':
			return messages.customerComment;
		default:
			return '';
	}
};

export const getTypeLabel = (type, types) => {
	if (types && types.length > 0) {
		for (let item of types) {
			if (type === item.type) {
				return item.label;
			}
		}
	} 
	return type;
};

const LOCALES_FILENAMES = [
	{
		locale: 'us',
		fileName: 'en'
	},
	{
		locale: 'vn',
		fileName: 'vi'
	}
];

export const getLanguageFileName = locale => {
	let fileName = 'en'
	LOCALES_FILENAMES.map(item => {
		if (item.locale === locale) {
			fileName = item.fileName;
		}
	});
	return fileName;
};

export const reCalculateTotalBySeller = order => {
	let sum_items_price_total = 0;
	let sum_items_discount_total = 0;
	let sum_discounts_amount = 0;
	// re-calculate tax included total
	const tax_included_total =
	(order.item_tax_included ? 0 : order.item_tax) +
	(order.shipping_tax_included ? 0 : order.shipping_tax);

	if (order.items && order.items.length > 0) {
		// re-calculate sum items price total
		order.items.forEach(item => {
			if (item.price_total > 0) {
				sum_items_price_total += item.price_total;
			}
		});

		// re-calculate sum items discount total
		order.items.forEach(item => {
			if (item.discount_total > 0) {
				sum_items_discount_total += item.discount_total;
			}
		});
		if (order.coupon && order.coupon.type == 'product') {
			order.items.forEach(item => {
				if (
					order.coupon.product_ids &&
					order.coupon.product_ids.length > 0
				) {
					for (let prodId of order.coupon.product_ids) {
						if (prodId == item.product_id.toString()) {
							sum_items_discount_total += order.coupon.amount;
						}
					}
				} else {
					sum_items_discount_total += order.coupon.amount;
				}
			});
		}
		if (order.coupon && order.coupon.type == 'product_percent') {
			order.items.forEach(item => {
				if (
					order.coupon.product_ids &&
					order.coupon.product_ids.length > 0
				) {
					for (let prodId of order.coupon.product_ids) {
						if (prodId == item.product_id.toString()) {
							sum_items_discount_total +=
								(item.price_total * order.coupon.amount) / 100;
						}
					}
				} else {
					sum_items_discount_total +=
						(item.price_total * order.coupon.amount) / 100;
				}
			});
		}
	}

	// re-calculate sum discount amount
	if (order.discounts && order.discounts.length > 0) {
		order.items.forEach(item => {
			if (item.amount > 0) {
				sum_discounts_amount += item.amount;
			}
		});
	}
	if (order.coupon) {
		if (order.coupon.type == 'cart') {
			sum_discounts_amount += order.coupon.amount;
		}

		if (order.coupon.type == 'cart_percent') {
			sum_discounts_amount +=
				(sum_items_price_total * order.coupon.amount) / 100;
		}

		if (order.coupon.type == 'free_shipping') {
			sum_discounts_amount += order.shipping_price;
		}
	}

	const discount_total = sum_items_discount_total + sum_discounts_amount;
	order.subtotal = sum_items_price_total; 
	order.grand_total = 
		sum_items_price_total +
		order.shipping_total +
		tax_included_total -
		discount_total;
	return order;
}

export const filterItemsBySeller = (order, seller) => {
	const items = order.items.filter(item =>
		seller ? item.seller === seller : true
	);
	order.items = items; 
	if (items && items.length > 0) {
		order = reCalculateTotalBySeller(order);
	}
	return order;
}