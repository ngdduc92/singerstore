import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text, tenantUrlName, locale } from '../../lib/settings';
import Cart from './cart';
import CartIndicator from './cartIndicator';
import SearchBox from './searchBox';
import HeadMenu from './headMenu';
import AccountPane from './accountPane';
import LanguagesPane from './languagesPane';
import * as helper from '../../lib/helper';

const Logo = ({ src, onClick, alt }) => (
	<NavLink
		className="logo-image"
		to={`/${tenantUrlName}/${locale}/`}
		onClick={onClick}
	>
		<img src={src} alt={alt} />
	</NavLink>
);

const BurgerButton = ({ onClick, className }) => (
	<span className={className} onClick={onClick}>
		<span />
		<span />
		<span />
	</span>
);

const BackButton = ({ onClick }) => (
	<span
		className="navbar-item is-hidden-tablet is-flex-mobile"
		onClick={onClick}
	>
		<img
			className="icon"
			src="/assets/images/arrow_back.svg"
			style={{ width: 18 }}
		/>
	</span>
);

const LanguageIcon = ({ onClick }) => {
	const country = helper.getCountry(locale);
	const countryImageUrl = helper.getCountryImageUrl(country);
	return (
		<span className="languages-button">
			<img
				src={countryImageUrl}
				className="icon"
				alt={country}
				title={country}
				style={{ width: 42, height: 42 }}
				onClick={onClick}
			/>
		</span>
	);
};

const SearchIcon = ({ onClick }) => (
	<span className="icon icon-search is-hidden-tablet" onClick={onClick}>
		<img
			src="/assets/images/search.svg"
			alt={text.search}
			title={text.search}
			style={{ minWidth: 24 }}
		/>
	</span>
);

const AccountIcon = () => (
	<div className="account-button">
		<img
			src="/assets/images/user.svg"
			className="icon"
			alt={text.account}
			title={text.account}
			style={{ minWidth: 24 }}
		/>
	</div>
);

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileMenuIsActive: false,
			mobileSearchIsActive: false,
			cartIsActive: false,
			languageIsActive: false
		};
	}

	menuToggle = () => {
		this.setState({
			mobileMenuIsActive: !this.state.mobileMenuIsActive,
			cartIsActive: false
		});
		document.body.classList.toggle('noscroll');
	};

	searchToggle = () => {
		this.setState({
			mobileSearchIsActive: !this.state.mobileSearchIsActive
		});
		document.body.classList.toggle('search-active');
	};

	menuClose = () => {
		this.setState({ mobileMenuIsActive: false });
		document.body.classList.remove('noscroll');
	};

	closeAll = () => {
		this.setState({
			cartIsActive: false,
			mobileMenuIsActive: false
		});
		document.body.classList.remove('noscroll');
	};

	cartToggle = () => {
		this.setState({
			cartIsActive: !this.state.cartIsActive,
			mobileMenuIsActive: false
		});
		document.body.classList.toggle('noscroll');
	};

	languagesToggle = () => {
		this.setState({
			languageIsActive: !this.state.languageIsActive,
			mobileMenuIsActive: false
		});
		document.body.classList.toggle('noscroll');
	};

	handleSearch = search => {
		const path = this.props.state.currentPage.path;
		if (path === `/${tenantUrlName}/${locale}/search`) {
			this.props.setSearch(search);
		} else {
			if (search && search !== '') {
				this.props.setLocation(
					`/${tenantUrlName}/${locale}/search?search=${search}`
				);
			}
		}
	};

	handleGoBack = () => {
		this.closeAll();
		this.props.goBack();
	};

	render() {
		const {
			categories,
			cart,
			settings,
			currentPage,
			location,
			productFilter
		} = this.props.state;
		const classToggle = this.state.mobileMenuIsActive
			? 'navbar-burger is-hidden-tablet is-active'
			: 'navbar-burger is-hidden-tablet';
		const showBackButton =
			currentPage.type === 'product' && location.hasHistory;

		return (
			<section className="section section-header">
				<header
					className={this.state.mobileSearchIsActive ? 'search-active' : ''}
				>
					<div className="is-mobile header-container">
						<div className="header-left-box">
							<div>
								{!showBackButton && (
									<BurgerButton
										onClick={this.menuToggle}
										className={classToggle}
									/>
								)}
								{showBackButton && <BackButton onClick={this.handleGoBack} />}
							</div>
							<div className="header-block-center">
								<SearchIcon onClick={this.searchToggle} />
							</div>
							<div className="header-logo has-text-centered">
								<Logo src={settings.logo} onClick={this.closeAll} alt="logo" />
							</div>
							<div className="search-area has-text-centered header-block-center">
								<SearchBox
									value={productFilter.search}
									onSearch={this.handleSearch}
									className={
										this.state.mobileSearchIsActive ? 'search-active' : ''
									}
								/>
							</div>
						</div>
						<div className="header-right-box">
							<div className="header-account has-text-centered header-block-center">
								<LanguageIcon onClick={this.languagesToggle} />
								<div
									className={
										this.state.languageIsActive ? 'languages-open' : ''
									}
								>
									<LanguagesPane languagesToggle={this.languagesToggle} />
								</div>
							</div>
							<div className="header-account has-text-centered header-block-center">
								<AccountIcon />
								<span className="header-account-label">{text.account}</span>
								<AccountPane />
							</div>
							<div
								className="header-cart has-text-centered header-block-center"
								onClick={this.cartToggle}
							>
								<CartIndicator
									cart={cart}
									cartIsActive={this.state.cartIsActive}
								/>
								<span className="header-cart-label">{text.cart}</span>
								<div
									className={this.state.cartIsActive ? 'mini-cart-open' : ''}
								>
									<Cart
										cart={cart}
										deleteCartItem={this.props.deleteCartItem}
										settings={settings}
										cartToggle={this.cartToggle}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="primary-nav is-hidden-mobile">
						<HeadMenu
							categories={categories}
							location={location}
							isMobile={false}
						/>
					</div>
				</header>

				<div
					className={
						this.state.mobileMenuIsActive || this.state.cartIsActive
							? 'dark-overflow'
							: ''
					}
					onClick={this.closeAll}
				/>
				<div
					className={
						'mobile-nav is-hidden-tablet' +
						(this.state.mobileMenuIsActive ? ' mobile-nav-open' : '')
					}
				>
					<HeadMenu
						isMobile={true}
						categories={categories}
						location={location}
						onClick={this.menuClose}
					/>
				</div>
			</section>
		);
	}
}

export default Header;
