export { initOnClient, initOnServer } from './lib/settings';
export { default as SharedContainer } from './containers/shared';
export { default as IndexContainer } from './containers/index';
export { default as CategoryContainer } from './containers/category';
export { default as ProductContainer } from './containers/product';
export { default as NotFoundContainer } from './containers/notfound';
export { default as PageContainer } from './containers/page';
export { default as CheckoutContainer } from './containers/checkout';
export {
	default as CheckoutSuccessContainer
} from './containers/checkoutSuccess';
export { default as SearchContainer } from './containers/search';
export { default as LoginContainer } from './containers/login';
export { default as ResetPasswordContainer } from './containers/resetPassword';
export { default as ActiveAccountContainer } from './containers/activeAccount';
export { default as ProfileContainer } from './containers/profile';
export {
	default as ChangePasswordContainer
} from './containers/changePassword';

// combine all css files into one with webpack. Hack to deal with server side rendering.
if (typeof window !== 'undefined') {
	require('../assets/scss/theme.scss');
}
