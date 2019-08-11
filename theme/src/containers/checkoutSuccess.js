import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as helper from '../lib/helper';
import MetaTags from '../components/metaTags';
import CheckoutSuccess from '../components/checkoutSuccess';
import { text } from '../lib/settings';

const CheckoutSuccessContainer = props => {
	const {
		state: { pageDetails, order, settings, shippingMethods }
	} = props;
	const shippingMethod = helper.getShippingMethodFromOrder(
		order,
		shippingMethods
	);

	return (
		<Fragment>
			<MetaTags
				title={text.checkoutSuccess}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.checkoutSuccess}
				ogDescription={pageDetails.meta_description}
			/>

			<section className="section section-checkout">
				<div className="container">
					<div className="columns content">
						<div className="column is-8 is-offset-2">
							<div className="checkout-box">
								<CheckoutSuccess
									order={order}
									settings={settings}
									pageDetails={pageDetails}
									shippingMethod={shippingMethod}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

CheckoutSuccessContainer.propTypes = {
	state: PropTypes.shape({
		settings: PropTypes.shape({}),
		pageDetails: PropTypes.shape({}),
		order: PropTypes.shape({}),
		shippingMethods: PropTypes.arrayOf(PropTypes.shape({}))
	}).isRequired
};

export default CheckoutSuccessContainer;
