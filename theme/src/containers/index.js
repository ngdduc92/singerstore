import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { themeSettings, text } from '../lib/settings';
import MetaTags from '../components/metaTags';
import ProductList from '../components/productList';
import HomeSlider from '../components/homeSlider';

const IndexContainer = props => {
	const {
		addCartItem,
		loadMoreProducts,
		state: {
			pageDetails,
			settings,
			products,
			productsHasMore,
			loadingProducts,
			loadingMoreProducts
		}
	} = props;
	return (
		<Fragment>
			<MetaTags
				title={text.home}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.home}
				ogDescription={pageDetails.meta_description}
			/>

			<HomeSlider images={themeSettings.home_slider} />

			<section className="section">
				<div className="container">
					<div className="title is-4 has-text-centered">
						{themeSettings.home_products_title}
					</div>
					<ProductList
						products={products}
						addCartItem={addCartItem}
						settings={settings}
						loadMoreProducts={loadMoreProducts}
						hasMore={productsHasMore}
						loadingProducts={loadingProducts}
						loadingMoreProducts={loadingMoreProducts}
					/>
				</div>
			</section>
		</Fragment>
	);
};

IndexContainer.propTypes = {
	addCartItem: PropTypes.func.isRequired,
	loadMoreProducts: PropTypes.func.isRequired,
	state: PropTypes.shape({
		settings: PropTypes.shape({}),
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default IndexContainer;
