import express from 'express';
import ProductsRoute from './routes/products';
import ProductCategoriesRoute from './routes/productCategories';
import ThemeRoute from './routes/theme';
import CustomersRoute from './routes/customers';
import CustomerGroupsRoute from './routes/customerGroups';
import OrdersRoute from './routes/orders';
import OrderStatusesRoute from './routes/orderStatuses';
import ShippingMethodsRoute from './routes/shippingMethods';
import PaymentMethodsRoute from './routes/paymentMethods';
import PaymentGatewaysRoute from './routes/paymentGateways';
import SettingsRoute from './routes/settings';
import PagesRoute from './routes/pages';
import NotificationsRoute from './routes/notifications';
import RedirectsRoute from './routes/redirects';
import WebhooksRoute from './routes/webhooks';
import TenantsRoute from './routes/tenants';
import UsersRoute from './routes/users';
import DiscountsRoute from './routes/discounts';
import CartRoute from './routes/cart';
import PublicRoute from './routes/public';
import SecurityKeysRoute from './routes/securityKeys';

const apiRouter = express.Router();

new ProductsRoute(apiRouter);
new ProductCategoriesRoute(apiRouter);
new ThemeRoute(apiRouter);
new CustomersRoute(apiRouter);
new CustomerGroupsRoute(apiRouter);
new OrdersRoute(apiRouter);
new OrderStatusesRoute(apiRouter);
new ShippingMethodsRoute(apiRouter);
new PaymentMethodsRoute(apiRouter);
new PaymentGatewaysRoute(apiRouter);
new SettingsRoute(apiRouter);
new PagesRoute(apiRouter);
new NotificationsRoute(apiRouter);
new RedirectsRoute(apiRouter);
new WebhooksRoute(apiRouter);
new TenantsRoute(apiRouter);
new UsersRoute(apiRouter);
new DiscountsRoute(apiRouter);
new CartRoute(apiRouter);
new PublicRoute(apiRouter);
new SecurityKeysRoute(apiRouter);

export default apiRouter;
