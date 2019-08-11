import React from 'react';
import TenantCreate from 'modules/tenants/create';

const TenantNew = props => {
	return (
		<div className="row row--no-gutter col-full-height scroll">
			<div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2">
				<TenantCreate />
			</div>
		</div>
	);
};

export default TenantNew;
