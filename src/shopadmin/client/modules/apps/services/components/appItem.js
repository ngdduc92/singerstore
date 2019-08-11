import React from 'react';
import Item from './item';

const ServiceItem = ({ app }) => {
	const tenantUrlName = location.pathname.split('/')[1];
	const locale = location.pathname.split('/')[2];
	return (
		<Item
			path={`/${tenantUrlName}/${locale}/admin/apps/app/${app.key}`}
			coverUrl={app.coverUrl}
			title={app.name}
		/>
	);
};

export default ServiceItem;
