import React from 'react';
import CustomersList from 'modules/customers/list';
import Groups from 'modules/customerGroups/list';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default () => (
	<div className="row row--no-gutter col-full-height">
		<div className="col-xs-12 col-sm-4 col-md-3 col--no-gutter scroll col-full-height">
			<Groups
				showAll={true}
				showRoot={false}
				showManage={userScopes.includes(scopes.READ_CUSTOMER_GROUP)}
			/>
		</div>
		<div className="col-xs-12 col-sm-8 col-md-9 col--no-gutter scroll col-full-height">
			<CustomersList />
		</div>
	</div>
);
