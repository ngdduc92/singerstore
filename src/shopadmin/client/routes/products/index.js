import React from 'react';
import ProductsList from 'modules/products/list';
import ProductsFilter from 'modules/products/listFilter';
import Categories from 'modules/productCategories/list';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default () => (
	<div className="row row--no-gutter col-full-height">
		<div className="col-xs-12 col-sm-4 col-md-3 col--no-gutter scroll col-full-height">
			<Categories
				showAll={true}
				showManage={userScopes.includes(scopes.READ_PRODUCT_CATEGORY)}
			/>
			<ProductsFilter />
		</div>
		<div className="col-xs-12 col-sm-8 col-md-9 col--no-gutter scroll col-full-height">
			<ProductsList />
		</div>
	</div>
);
