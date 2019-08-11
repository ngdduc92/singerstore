import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { text, locale } from '../lib/settings';
import * as helper from '../lib/helper';

const CategoryBreadcrumbs = ({
	currentCategory,
	categories,
	tenantUrlName
}) => {
	const items = helper.getCategoryBreadcrumbs(
		tenantUrlName,
		locale,
		currentCategory.id,
		categories
	);
	return (
		<nav className="breadcrumb is-small" aria-label="breadcrumbs">
			<ul>
				<li>
					<NavLink to={`/${tenantUrlName}/${locale}/`}>{text.all}</NavLink>
				</li>
				{items}
				<li className="is-active">
					<a
						href={`/${tenantUrlName}/${locale}${currentCategory.path}`}
						aria-current="page"
					>
						{currentCategory.name}
					</a>
				</li>
			</ul>
		</nav>
	);
};

CategoryBreadcrumbs.propTypes = {
	currentCategory: PropTypes.shape({}).isRequired,
	categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	tenantUrlName: PropTypes.string
};

export default CategoryBreadcrumbs;
