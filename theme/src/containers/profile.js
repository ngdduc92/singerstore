import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MetaTags from '../components/metaTags';
import Profile from '../components/profile';
import { text } from '../lib/settings';

const ProfileContainer = props => {
	const {
		state: { pageDetails }
	} = props;

	return (
		<Fragment>
			<MetaTags
				title={text.myProfile}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={text.myProfile}
				ogDescription={pageDetails.meta_description}
			/>

			<section className="section section-checkout">
				<div className="container">
					<div className="columns content">
						<div className="column is-8 is-offset-2">
							<Profile {...props} />
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

ProfileContainer.propTypes = {
	state: PropTypes.shape({
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default ProfileContainer;
