import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MetaTags from '../components/metaTags';
import ChangePassword from '../components/changePassword';
import { text } from '../lib/settings';

const ChangePasswordContainer = props => {
	const {
		state: { pageDetails }
	} = props;

	return (
		<Fragment>
			<MetaTags
				title={text.changePassword}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.changePassword}
				ogDescription={pageDetails.meta_description}
			/>

			<section className="section section-checkout">
				<div className="container">
					<div className="columns content">
						<div className="column is-8 is-offset-2">
							<ChangePassword {...props} />
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

ChangePasswordContainer.propTypes = {
	state: PropTypes.shape({
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default ChangePasswordContainer;
