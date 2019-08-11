import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { themeSettings, locale } from '../lib/settings';
import Header from '../components/header';
import Footer from '../components/footer';
import NotFoundContainer from './notfound';

const SharedContainer = props => {
	const {
		children,
		state: { currentPage, settings }
	} = props;
	const tenantUrlName = currentPage.path.split('/')[1];
	const hideHeader =
		currentPage.path === `/${tenantUrlName}/${locale}/reset-password` ||
		currentPage.path === `/${tenantUrlName}/${locale}/active-account`;
	const hideFooter =
		((currentPage.path === `/${tenantUrlName}/${locale}/checkout` ||
			currentPage.path === `/${tenantUrlName}/${locale}/checkout-success`) &&
			themeSettings.hide_footer_on_checkout === true) ||
		hideHeader;
	let component = null;
	if (themeSettings) {
		component = (
			<Fragment>
				{!hideHeader && <Header {...props} />}
				{children}
				{!hideFooter && <Footer settings={settings} />}
			</Fragment>
		);
	} else {
		component = <NotFoundContainer />;
	}
	return component;
};

SharedContainer.propTypes = {
	children: PropTypes.element.isRequired,
	state: PropTypes.shape({
		currentPage: PropTypes.shape({}),
		settings: PropTypes.shape({})
	}).isRequired
};

export default SharedContainer;
