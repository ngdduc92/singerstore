import winston from 'winston';
import url from 'url';
import { MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';
import settings from './lib/settings';
import utils from './lib/utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import roles from './lib/roles';

const mongodbConnection = settings.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);

const CONNECT_OPTIONS = {
	useNewUrlParser: true
};

const DEFAULT_LANGUAGE = 'english';

const addEmailTemplates = async (db, tenantObject) => {
	await db.collection('emailTemplates').insertOne({
		tenant_id: tenantObject.insertedId,
		deleted: false,
		name: 'account_activation',
		subject: 'Account activation',
		body:
			'<div> <div style="color: #202020; line-height: 1.5;">       Please click on the following link to active your account.       <div style="padding: 60px 0px;">{{link}}</div>    If this was not you, you can safely ignore this email.<br /><br />       Best,<br />       EShop Robot</div>'
	});

	winston.info('- Added email template for Account Activation');

	await db.collection('emailTemplates').insertOne({
		tenant_id: tenantObject.insertedId,
		deleted: false,
		name: 'account_info',
		subject: 'Account Info',
		body:
			'<div> <div style="color: #202020; line-height: 1.5;">       You have been created an account on {{link}}.       <div style="padding: 60px 0px 0px 0px;">Email: {{email}}</div> <div style="padding: 0px 0px 60px 0px;">Password: {{password}}</div>   If this was not you, you can safely ignore this email.<br /><br />       Best,<br />       EShop Robot</div>'
	});

	winston.info('- Added email template for Account Activation');

	await db.collection('emailTemplates').insertOne({
		tenant_id: tenantObject.insertedId,
		deleted: false,
		name: 'reset_password',
		subject: 'Reset Password',
		body:
			'<div> <div style="color: #202020; line-height: 1.5;">       Click the following link to reset your password.      <div style="padding: 60px 0px;">{{link}}</div>    If this was not you, you can safely ignore this email.<br /><br />       Best,<br />      EShop Robot</div>'
	});

	winston.info('- Added email template for Reset Password');

	await db.collection('emailTemplates').insertOne({
		tenant_id: tenantObject.insertedId,
		deleted: false,
		name: 'order_confirmation',
		subject: 'Order confirmation',
		body: `<div>
		<div><b>Order number</b>: {{number}}</div>
		<div><b>Shipping method</b>: {{shipping_method}}</div>
		<div><b>Payment method</b>: {{payment_method}}</div>
		
		<div style="width: 100%; margin-top: 20px;">
			Shipping to<br /><br />
			<b>Full name</b>: {{shipping_address.full_name}}<br />
			<b>Address 1</b>: {{shipping_address.address1}}<br />
			<b>Address 2</b>: {{shipping_address.address2}}<br />
			<b>Postal code</b>: {{shipping_address.postal_code}}<br />
			<b>City</b>: {{shipping_address.city}}<br />
			<b>State</b>: {{shipping_address.state}}<br />
			<b>Phone</b>: {{shipping_address.phone}}
		</div>
		
		<table style="width: 100%; margin-top: 20px;">
			<tr>
			<td style="width: 40%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: left;">Item</td>
			<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Price</td>
			<td style="width: 10%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Qty</td>
			<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Total</td>
			</tr>
		
			{{#each items}}
			<tr>
			<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: left;">{{name}}<br />{{variant_name}}</td>
			<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price}}</td>
			<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">{{quantity}}</td>
			<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price_total}}</td>
			</tr>
			{{/each}}
		
		</table>
		
		<table style="width: 100%; margin: 20px 0;">
			<tr>
			<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Subtotal</b></td>
			<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{subtotal}}</td>
			</tr>
			<tr>
			<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Shipping</b></td>
			<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{shipping_total}}</td>
			</tr>
			<tr>
			<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Discount</b></td>
			<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{discount_total}}</td>
			</tr>
			<tr>
			<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Grand total</b></td>
			<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{grand_total}}</td>
			</tr>
		</table>
		
		</div>`
	});

	winston.info('- Added email template for Order Confirmation');
};

const addThemeSettings = async (db, tenantObject) => {
	await db.collection('themeSettings').insertOne({
		tenant_id: tenantObject.insertedId,
		deleted: false,
		bigThumbnailWidth: 800,
		button_addtocart_bg: '#ff8000',
		button_addtocart_color: '#ffffff',
		button_addtocart_text: '',
		button_loadmore_bg: '#ff8000',
		button_loadmore_color: '#ffffff',
		cartThumbnailWidth: 100,
		checkoutButtonClass: 'checkout-button button is-primary',
		checkoutEditButtonClass: 'checkout-button button',
		checkoutInputClass: 'checkout-field',
		details_price_color: '#ff8000',
		disqus_shortname: '',
		footer_about: '',
		footer_contacts: [
			{
				text: ''
			},
			{
				text: ''
			},
			{
				text: ''
			},
			{
				text: ''
			}
		],
		footer_logo_url: '',
		footer_menu_1_items: [
			{
				text: 'About',
				url: ''
			},
			{
				text: 'Careers',
				url: ''
			},
			{
				text: 'Brand Inquiries',
				url: ''
			}
		],
		footer_menu_1_title: 'Company',
		footer_menu_2_items: [
			{
				text: 'FAQ / Contact us',
				url: ''
			},
			{
				text: 'Return Policy',
				url: ''
			},
			{
				text: 'Shipping & Tax',
				url: ''
			}
		],
		footer_menu_2_title: 'Customer service',
		footer_social: [
			{
				type: 'facebook',
				url: ''
			},
			{
				type: 'twitter',
				url: ''
			}
		],
		hide_footer_on_checkout: false,
		home_gallery_shownav: true,
		home_products_limit: 8,
		home_products_sort: '-date_updated',
		home_products_title: '',
		home_slider: [],
		home_slider_color: '#ffffff',
		limit_viewed_products: 4,
		listThumbnailWidth: 340,
		list_image_max_height: 280,
		list_price_color: '#ff8000',
		maxCartItemQty: 100,
		page_list_tag: 'blog',
		previewThumbnailWidth: 100,
		product_gallery_shownav: true,
		product_thumbnail_position: 'left',
		search_placeholder: '',
		show_category_breadcrumbs: true,
		show_discount_countdown: true,
		show_product_breadcrumbs: true,
		show_product_filter: true,
		show_viewed_products: true,
		sortNewest: '-date_created',
		sortPriceHigh: '-price',
		sortPriceLow: 'price'
	});

	winston.info('- Added theme setting');
};

const addCategories = async (db, tenantObject) => {
	await db.collection('productCategories').insertMany([
		{
			date_created: new Date(),
			date_updated: new Date(),
			image: '',
			name: 'Women',
			description: '',
			meta_description: '',
			meta_title: '',
			enabled: true,
			sort: '',
			parent_id: null,
			position: 1,
			tenant_id: tenantObject.insertedId,
			slug: 'women',
			deleted: false
		},
		{
			date_created: new Date(),
			date_updated: new Date(),
			image: '',
			name: 'Men',
			description: '',
			meta_description: '',
			meta_title: '',
			enabled: true,
			sort: '',
			parent_id: null,
			position: 2,
			tenant_id: tenantObject.insertedId,
			slug: 'men',
			deleted: false
		},
		{
			date_created: new Date(),
			date_updated: new Date(),
			image: '',
			name: 'Kids',
			description: '',
			meta_description: '',
			meta_title: '',
			enabled: true,
			sort: '',
			parent_id: null,
			position: 3,
			tenant_id: tenantObject.insertedId,
			slug: 'kids',
			deleted: false
		}
	]);
	winston.info(`- Added sample categories`);
};

const addEmailSettings = async db => {
	await db.collection('emailSettings').insertOne({
		host: 'smtp.gmail.com',
		port: 465,
		user: 'dinhduc.nguyen92@gmail.com',
		pass: utils.encrypt(settings.smtpPassword),
		from_name: 'Duc Nguyen',
		from_address: 'dinhduc.nguyen92@gmail.com'
	});
	winston.info(`- Added email setting`);
};

const addOwnerTenant = async (db, email) => {
	if (email && email.includes('@')) {
		const tenantsCount = await db.collection('tenants').countDocuments({
			email: email,
			deleted: false
		});
		if (tenantsCount === 0) {
			const ownerTenant = await db.collection('tenants').insertOne({
				deleted: false,
				date_created: new Date(),
				date_updated: null,
				name: 'Owner Organization',
				url_name: 'dashboard',
				email: email,
				enabled: true
			});
			winston.info(`- Added owner tenant with email: ${email}`);

			await db.collection('users').insertOne({
				deleted: false,
				date_created: new Date(),
				date_updated: null,
				tenant_id: ownerTenant.insertedId,
				email: email,
				password: bcrypt.hashSync(settings.ownerPassword, 12),
				role: roles.OWNER,
				enabled: true
			});
			winston.info(`- Added superuser with email: ${email}`);

			await addEmailTemplates(db, ownerTenant);
			await addThemeSettings(db, ownerTenant);
			await addCategories(db, ownerTenant);
			await addEmailSettings(db);
			await addDiscountTypes(db, ownerTenant);
		}
	}
};

const addSecurityKeys = async db => {
	await db.collection('securityKeys').remove({});

	await db.collection('securityKeys').insertMany([
		{
			_id: ObjectID('5d2fe82801e69e0ac169ae9d'),
			app_name: 'eShop Desktop',
			app_id: 'singerstore.5d2fe82801e69e0ac169ae9d',
			access_key: jwt.sign(
				{
					jti: '5d2fe82801e69e0ac169ae9d',
					app_id: 'singerstore.5d2fe82801e69e0ac169ae9d'
				},
				settings.jwtSecretKey
			),
			date_created: new Date(),
			revoked: false,
			deleted: false,
			enabled: true
		},
		{
			_id: ObjectID('5d2fe82801e69e0ac169ae9e'),
			app_name: 'eShop Mobile',
			app_id: 'singerstore.5d2fe82801e69e0ac169ae9e',
			access_key: jwt.sign(
				{
					jti: '5d2fe82801e69e0ac169ae9e',
					app_id: 'singerstore.5d2fe82801e69e0ac169ae9e'
				},
				settings.jwtSecretKey
			),
			date_created: new Date(),
			revoked: false,
			deleted: false,
			enabled: true
		}
	]);

	winston.info(`- Added security keys`);
};

const createIndex = (db, collectionName, fields, options) =>
	db.collection(collectionName).createIndex(fields, options);

const createAllIndexes = async db => {
	const tenantsIndexes = await db
		.collection('tenants')
		.listIndexes()
		.toArray();

	if (tenantsIndexes.length === 1) {
		await createIndex(db, 'tenants', { deleted: 1 });
		await createIndex(db, 'tenants', { enabled: 1 });
		await createIndex(db, 'tenants', { url_name: 1 });
		await createIndex(db, 'tenants', { email: 1 });
		await createIndex(
			db,
			'tenants',
			{
				name: 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
		winston.info('- Created indexes for: tenants');
	}

	const usersIndexes = await db
		.collection('users')
		.listIndexes()
		.toArray();

	if (usersIndexes.length === 1) {
		await createIndex(db, 'users', { tenant_id: 1 });
		await createIndex(db, 'users', { deleted: 1 });
		await createIndex(db, 'users', { enabled: 1 });
		await createIndex(db, 'users', { email: 1 });
		await createIndex(
			db,
			'users',
			{
				full_name: 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
		winston.info('- Created indexes for: users');
	}

	const pagesIndexes = await db
		.collection('pages')
		.listIndexes()
		.toArray();

	if (pagesIndexes.length === 1) {
		await createIndex(db, 'pages', { tenant_id: 1 });
		await createIndex(db, 'pages', { deleted: 1 });
		await createIndex(db, 'pages', { enabled: 1 });
		await createIndex(db, 'pages', { slug: 1 });
		winston.info('- Created indexes for: pages');
	}

	const productCategoriesIndexes = await db
		.collection('productCategories')
		.listIndexes()
		.toArray();

	if (productCategoriesIndexes.length === 1) {
		await createIndex(db, 'productCategories', { tenant_id: 1 });
		await createIndex(db, 'productCategories', { deleted: 1 });
		await createIndex(db, 'productCategories', { enabled: 1 });
		await createIndex(db, 'productCategories', { slug: 1 });
		winston.info('- Created indexes for: productCategories');
	}

	const productsIndexes = await db
		.collection('products')
		.listIndexes()
		.toArray();

	if (productsIndexes.length === 1) {
		await createIndex(db, 'products', { tenant_id: 1 });
		await createIndex(db, 'products', { deleted: 1 });
		await createIndex(db, 'products', { slug: 1 });
		await createIndex(db, 'products', { enabled: 1 });
		await createIndex(db, 'products', { category_id: 1 });
		await createIndex(db, 'products', { sku: 1 });
		await createIndex(db, 'products', {
			'attributes.name': 1,
			'attributes.value': 1
		});
		await createIndex(
			db,
			'products',
			{
				name: 'text',
				description: 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
		winston.info('- Created indexes for: products');
	}

	const customersIndexes = await db
		.collection('customers')
		.listIndexes()
		.toArray();

	if (customersIndexes.length === 1) {
		await createIndex(db, 'customers', { tenant_id: 1 });
		await createIndex(db, 'customers', { deleted: 1 });
		await createIndex(db, 'customers', { group_id: 1 });
		await createIndex(db, 'customers', { email: 1 });
		await createIndex(db, 'customers', { mobile: 1 });
		await createIndex(
			db,
			'customers',
			{
				full_name: 'text',
				'addresses.address1': 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
		winston.info('- Created indexes for: customers');
	}

	const ordersIndexes = await db
		.collection('orders')
		.listIndexes()
		.toArray();

	if (ordersIndexes.length === 1) {
		await createIndex(db, 'orders', { tenant_id: 1 });
		await createIndex(db, 'orders', { deleted: 1 });
		await createIndex(db, 'orders', { draft: 1 });
		await createIndex(db, 'orders', { number: 1 });
		await createIndex(db, 'orders', { customer_id: 1 });
		await createIndex(db, 'orders', { email: 1 });
		await createIndex(db, 'orders', { mobile: 1 });
		await createIndex(
			db,
			'orders',
			{
				'shipping_address.full_name': 'text',
				'shipping_address.address1': 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
		winston.info('- Created indexes for: orders');
	}

	const discountsIndexes = await db
		.collection('discounts')
		.listIndexes()
		.toArray();

	if (discountsIndexes.length === 1) {
		await createIndex(db, 'discounts', { tenant_id: 1 });
		await createIndex(db, 'discounts', { deleted: 1 });
		await createIndex(db, 'discounts', { enabled: 1 });
		await createIndex(db, 'discounts', { code: 1 });
		winston.info('- Created indexes for: discounts');
	}

	const securityKeysIndexes = await db
		.collection('securityKeys')
		.listIndexes()
		.toArray();

	if (securityKeysIndexes.length === 1) {
		await createIndex(db, 'securityKeys', { app_id: 1 });
		await createIndex(db, 'securityKeys', { deleted: 1 });
		await createIndex(db, 'securityKeys', { revoked: 1 });
		await createIndex(db, 'securityKeys', { enabled: 1 });
		winston.info('- Created indexes for: securityKeys');
	}
};

const addSettings = async (db, { domain }) => {
	if (domain && (domain.includes('https://') || domain.includes('http://'))) {
		await db.collection('settings').updateOne(
			{},
			{
				$set: {
					domain
				}
			},
			{ upsert: true }
		);
		winston.info(`- Set domain: ${domain}`);
	}
};

(async () => {
	let client = null;
	let db = null;

	try {
		client = await MongoClient.connect(mongodbConnection, CONNECT_OPTIONS);
		db = client.db(dbName);
		winston.info(`Successfully connected to ${mongodbConnection}`);
	} catch (e) {
		winston.error(`MongoDB connection was failed. ${e.message}`);
		return;
	}

	const domain = process.argv.length > 3 ? process.argv[3] : null;

	await db.createCollection('productCategories');
	await db.createCollection('products');
	await db.createCollection('customers');
	await db.createCollection('pages');
	await db.createCollection('orders');
	await db.createCollection('discounts');

	await addOwnerTenant(db, 'superuser@singerstore.com');
	await addSecurityKeys(db);

	await createAllIndexes(db);

	await addSettings(db, {
		domain
	});

	client.close();
})();
