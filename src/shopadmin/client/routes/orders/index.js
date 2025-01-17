import React from 'react';
import OrdersList from 'modules/orders/list';
import OrdersFilter from 'modules/orders/listFilter';
import Statuses from 'modules/orderStatuses/list';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default () => (
	<div className="row row--no-gutter col-full-height">
		<div className="col-xs-12 col-sm-4 col-md-3 col--no-gutter scroll col-full-height">
			<Statuses
				showAll={true}
				showManage={userScopes.includes(scopes.READ_ORDER_STATUS)}
			/>
			<OrdersFilter />
		</div>
		<div className="col-xs-12 col-sm-8 col-md-9 col--no-gutter scroll col-full-height">
			<OrdersList />
		</div>
	</div>
);
