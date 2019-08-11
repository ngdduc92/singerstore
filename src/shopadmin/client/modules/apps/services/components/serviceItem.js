import React from 'react';
import Item from './item';

const ServiceItem = ({ service }) => {
	const tenantUrlName = location.pathname.split('/')[1];
	const locale = location.pathname.split('/')[2];
	return (
		<Item
			path={`/${tenantUrlName}/${locale}/admin/apps/service/${service.id}`}
			coverUrl={service.cover_url}
			title={service.name}
			developer={service.developer.name}
			enabled={service.enabled}
		/>
	);
};

export default ServiceItem;
