import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MetaTags from '../components/metaTags';
import ActiveAccount from '../components/activeAccount';
import { text } from '../lib/settings';

const ActiveAccountContainer = props => {
	const {
		state: { pageDetails }
	} = props;

	return (
		<Fragment>
			<MetaTags
				title={text.activeAccount}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.activeAccount}
				ogDescription={pageDetails.meta_description}
			/>

			<section className="section section-checkout">
				<div className="container">
					<div className="columns content">
						<div className="column is-8 is-offset-2">
							<div className="checkout-box">
								<ActiveAccount {...props} />
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

ActiveAccountContainer.propTypes = {
	state: PropTypes.shape({
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default ActiveAccountContainer;
