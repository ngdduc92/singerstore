import React from 'react';
import TenantInfoForm from 'modules/tenants/tenantInfo';

const TenantInfo = props => {
	return (
		<div className="row row--no-gutter col-full-height scroll">
			<div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2">
				<TenantInfoForm />
			</div>
		</div>
	);
};

export default TenantInfo;
