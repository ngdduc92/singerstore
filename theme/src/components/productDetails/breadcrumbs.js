import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text, locale, tenantUrlName } from '../../lib/settings';
import * as helper from '../../lib/helper';

const ProductBreadcrumbs = ({ product, categories }) => {
	const items = helper.getProductBreadcrumbs(
		tenantUrlName,
		locale,
		product,
		categories
	);
	return (
		<nav
			className="breadcrumb is-small product-breadcrumb"
			aria-label="breadcrumbs"
		>
			<ul>
				<li>
					<NavLink to={`/${tenantUrlName}/${locale}/`}>{text.all}</NavLink>
				</li>
				{items}
			</ul>
		</nav>
	);
};

export default ProductBreadcrumbs;
