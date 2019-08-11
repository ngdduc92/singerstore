import React, { Fragment } from 'react';
import MetaTags from '../components/metaTags';
import ResetPassword from '../components/resetPassword';
import { text } from '../lib/settings';
import PropTypes from 'prop-types';

const ResetPasswordContainer = props => {
	const {
		state: { pageDetails }
	} = props;

	return (
		<Fragment>
			<MetaTags
				title={text.resetPassword}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.resetPassword}
				ogDescription={pageDetails.meta_description}
			/>

			<section className="section section-checkout">
				<div className="container">
					<div className="columns content">
						<div className="column is-8 is-offset-2">
							<div className="checkout-box">
								<ResetPassword {...props} />
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

ResetPasswordContainer.propTypes = {
	state: PropTypes.shape({
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default ResetPasswordContainer;
