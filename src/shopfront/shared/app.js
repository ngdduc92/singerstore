import React, { Fragment } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import IndexContainer from './containers/index';
import SharedContainer from './containers/shared';
import CategoryContainer from './containers/category';
import ProductContainer from './containers/product';
import PageContainer from './containers/page';
import CheckoutContainer from './containers/checkout';
import CheckoutSuccessContainer from './containers/checkoutSuccess';
import NotFoundContainer from './containers/notfound';
import SearchContainer from './containers/search';
import LoginContainer from './containers/login';
import ResetPasswordContainer from './containers/resetPassword';
import ActiveAccountContainer from './containers/activeAccount';
import ProfileContainer from './containers/profile';
import ChangePasswordContainer from './containers/changePassword';
import { setCurrentPage } from './actions';
import {
	SYSTEM_PAGE,
	PAGE,
	PRODUCT_CATEGORY,
	PRODUCT,
	RESERVED,
	SEARCH
} from './pageTypes';

class SwitchContainers extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		this.props.setCurrentPage(nextProps.location);
		const tenantUrlName = nextProps.location.pathname.split('/')[1];
		const locale = nextProps.location.pathname.split('/')[2];
		if (nextProps.location && this.props.location) {
			const pathnameChanged =
				nextProps.location.pathname !== this.props.location.pathname;
			const queryChanged =
				nextProps.location.search !== this.props.location.search;
			const isSearchPage =
				nextProps.location.pathname === `/${tenantUrlName}/${locale}/search`;

			if (pathnameChanged || (queryChanged && isSearchPage)) {
				animateScroll.scrollToTop({
					duration: 500,
					delay: 100,
					smooth: true
				});
			}
		}
	}

	render() {
		const { location, currentPage } = this.props;
		const pathname = location && location.pathname ? location.pathname : '/';
		const tenantUrlName = pathname.split('/')[1];
		const locale = pathname.split('/')[2];
		let container = null;
		let isLogin = true;
		switch (currentPage.type) {
			case PRODUCT:
				container = <ProductContainer />;
				break;
			case PRODUCT_CATEGORY:
				container = <CategoryContainer />;
				break;
			case SEARCH:
				container = <SearchContainer />;
				break;
			case SYSTEM_PAGE:
				switch (pathname) {
					case `/${tenantUrlName}/${locale}/`:
						container = <IndexContainer />;
						break;
					case `/${tenantUrlName}/${locale}/checkout`:
						container = <CheckoutContainer />;
						break;
					case `/${tenantUrlName}/${locale}/checkout-success`:
						container = <CheckoutSuccessContainer />;
						break;
					case `/${tenantUrlName}/${locale}/reset-password`:
						container = <ResetPasswordContainer />;
						isLogin = false;
						break;
					case `/${tenantUrlName}/${locale}/active-account`:
						container = <ActiveAccountContainer />;
						isLogin = false;
						break;
					case `/${tenantUrlName}/${locale}/profile`:
						container = <ProfileContainer />;
						break;
					case `/${tenantUrlName}/${locale}/change-password`:
						container = <ChangePasswordContainer />;
						break;
					default:
						container = null;
				}
				break;
			case PAGE:
				container = <PageContainer />;
				break;
			default:
				container = <NotFoundContainer />;
				isLogin = false;
		}
		return (
			<Fragment>
				{isLogin && <LoginContainer />}
				{container}
			</Fragment>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		currentPage: state.app.currentPage
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setCurrentPage: location => {
			dispatch(setCurrentPage(location));
		}
	};
};

const SwitchContainersConnected = connect(
	mapStateToProps,
	mapDispatchToProps
)(SwitchContainers);

const App = () => (
	<SharedContainer>
		<Route component={SwitchContainersConnected} />
	</SharedContainer>
);

export default App;
