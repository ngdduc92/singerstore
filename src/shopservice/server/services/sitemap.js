import { db } from '../lib/mongo';
import parse from '../lib/parse';

const systemPageSlugs = [
	'',
	'checkout',
	'checkout-success',
	'reset-password',
	'active-account',
	'profile',
	'change-password'
];

class SitemapService {
	constructor() {}

	getPaths(tenantId, tenantUrlName, locale, onlyEnabled) {
		const slug = null;
		onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);

		return Promise.all([
			this.getSlugArrayFromReserved(tenantUrlName, locale),
			this.getSlugArrayFromProductCategories(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			),
			this.getSlugArrayFromProducts(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			),
			this.getSlugArrayFromPages(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			)
		]).then(([reserved, productCategories, products, pages]) => {
			let paths = [...reserved, ...productCategories, ...products, ...pages];
			return paths;
		});
	}

	getPathsWithoutSlashes(tenantId, tenantUrlName, slug, onlyEnabled, locale) {
		return Promise.all([
			this.getSlugArrayFromReserved(tenantUrlName, locale),
			this.getSlugArrayFromProductCategories(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			),
			this.getSlugArrayFromProductsWithoutCategory(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			),
			this.getSlugArrayFromPages(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			)
		]).then(([reserved, productCategories, products, pages]) => {
			let paths = [...reserved, ...productCategories, ...products, ...pages];
			return paths;
		});
	}

	getPathsWithSlash(tenantId, tenantUrlName, slug, onlyEnabled, locale) {
		return Promise.all([
			this.getSlugArrayFromProducts(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			),
			this.getSlugArrayFromPages(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			)
		]).then(([products, pages]) => {
			let paths = [...products, ...pages];
			return paths;
		});
	}

	getSlugArrayFromReserved(tenantUrlName, locale) {
		let paths = [];

		paths.push({ path: '/api', type: 'reserved' });
		paths.push({ path: '/ajax', type: 'reserved' });
		paths.push({ path: '/assets', type: 'reserved' });
		paths.push({ path: '/images', type: 'reserved' });
		paths.push({ path: '/admin', type: 'reserved' });
		paths.push({ path: '/signin', type: 'reserved' });
		paths.push({ path: '/signout', type: 'reserved' });
		paths.push({ path: '/signup', type: 'reserved' });
		paths.push({ path: '/post', type: 'reserved' });
		paths.push({ path: '/posts', type: 'reserved' });
		paths.push({ path: '/public', type: 'reserved' });
		paths.push({ path: '/rss', type: 'reserved' });
		paths.push({ path: '/feed', type: 'reserved' });
		paths.push({ path: '/setup', type: 'reserved' });
		paths.push({ path: '/tag', type: 'reserved' });
		paths.push({ path: '/tags', type: 'reserved' });
		paths.push({ path: '/user', type: 'reserved' });
		paths.push({ path: '/users', type: 'reserved' });
		paths.push({ path: '/sitemap.xml', type: 'reserved' });
		paths.push({ path: '/robots.txt', type: 'reserved' });
		paths.push({ path: '/settings', type: 'reserved' });
		paths.push({ path: '/find', type: 'reserved' });
		paths.push({ path: '/account', type: 'reserved' });
		paths.push({
			path: `/${tenantUrlName}/${locale}/search`,
			type: 'search'
		});

		return paths;
	}

	getSlugArrayFromProducts(tenantId, tenantUrlName, slug, onlyEnabled, locale) {
		const categoriesFilter = {};
		const productFilter = {};
		if (slug) {
			const slugParts = slug.split('/');
			categoriesFilter.slug = slugParts[0];
			productFilter.slug = slugParts[1];
		}
		if (onlyEnabled === true) {
			productFilter.enabled = true;
		}
		const tenant_id = parse.getObjectIDIfValid(tenantId);
		categoriesFilter.tenant_id = tenant_id;
		productFilter.tenant_id = tenant_id;
		categoriesFilter.deleted = false;
		productFilter.deleted = false;

		return Promise.all([
			db
				.collection('productCategories')
				.find(categoriesFilter)
				.project({ slug: 1 })
				.toArray(),
			db
				.collection('products')
				.find(productFilter)
				.project({ slug: 1, category_id: 1 })
				.toArray()
		]).then(([categories, products]) => {
			return products.map(product => {
				const category = categories.find(
					c => c._id.toString() === (product.category_id || '').toString()
				);
				const categorySlug = category ? category.slug : '-';
				const path = `/${tenantUrlName}/${locale}/${categorySlug}/${
					product.slug
				}`;
				return {
					path: path,
					type: 'product',
					resource: product._id
				};
			});
		});
	}

	getSlugArrayFromProductsWithoutCategory(
		tenantId,
		tenantUrlName,
		slug,
		onlyEnabled,
		locale
	) {
		const productFilter = {};
		if (slug) {
			productFilter.slug = slug;
		}
		if (onlyEnabled === true) {
			productFilter.enabled = true;
		}
		productFilter.tenant_id = parse.getObjectIDIfValid(tenantId);
		productFilter.deleted = false;

		return Promise.all([
			db
				.collection('products')
				.find(productFilter)
				.project({ slug: 1 })
				.toArray()
		]).then(([products]) => {
			return products.map(product => {
				const path = `/${tenantUrlName}/${locale}/${product.slug}`;
				return {
					path: path,
					type: 'product',
					resource: product._id
				};
			});
		});
	}

	getSlugFromSystemPage(tenantUrlName, slug, locale) {
		return {
			path: `/${tenantUrlName}/${locale}/${slug}`,
			type: 'system-page',
			resource: null
		};
	}

	getSlugArrayFromSystemPages(tenantUrlName, locale) {
		const items = [];
		systemPageSlugs.map(slug => {
			items.push(this.getSlugFromSystemPage(tenantUrlName, slug, locale));
		});
		return items;
	}

	getSlugArrayFromPages(tenantId, tenantUrlName, slug, onlyEnabled, locale) {
		const filter = this.getFilterWithoutSlashes(slug);
		if (onlyEnabled === true) {
			filter.enabled = true;
		}
		filter.tenant_id = parse.getObjectIDIfValid(tenantId);
		filter.deleted = false;

		return db
			.collection('pages')
			.find(filter)
			.project({ slug: 1 })
			.toArray()
			.then(items => {
				const slugArrayFromPages = items.map(item => {
					const path = `/${tenantUrlName}/${locale}/${item.slug}`;
					return {
						path: path,
						type: 'page',
						resource: item._id
					};
				});
				return slugArrayFromPages.concat(
					this.getSlugArrayFromSystemPages(tenantUrlName, locale)
				);
			});
	}

	getSlugArrayFromProductCategories(
		tenantId,
		tenantUrlName,
		slug,
		onlyEnabled,
		locale
	) {
		const filter = this.getFilterWithoutSlashes(slug);
		filter.tenant_id = parse.getObjectIDIfValid(tenantId);
		if (onlyEnabled === true) {
			filter.enabled = true;
		}
		filter.deleted = false;

		return db
			.collection('productCategories')
			.find(filter)
			.project({ slug: 1 })
			.toArray()
			.then(items =>
				items.map(item => {
					const path = `/${tenantUrlName}/${locale}/${item.slug}`;
					return {
						path: path,
						type: 'product-category',
						resource: item._id
					};
				})
			);
	}

	getFilterWithoutSlashes(slug) {
		if (slug) {
			return { slug: slug };
		} else {
			return {};
		}
	}

	getSinglePath(tenantId, tenantUrlName, path, locale, onlyEnabled = false) {
		onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);
		// remove /:tenantUrlName/:locale/
		const slug = path.substr(tenantUrlName.length + locale.length + 3);
		if (slug.includes('/')) {
			// slug = category-slug/product-slug
			return this.getPathsWithSlash(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			).then(paths => paths.find(e => e.path === path));
		} else {
			// slug = slug
			return this.getPathsWithoutSlashes(
				tenantId,
				tenantUrlName,
				slug,
				onlyEnabled,
				locale
			).then(paths => paths.find(e => e.path === path));
		}
	}
}

export default new SitemapService();
