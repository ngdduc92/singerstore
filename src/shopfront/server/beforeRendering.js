import api from './api';

const beforeRendering = (req, res, next) => {
	return api.public
		.getTenantIdByUrlName(req.params.tenantUrlName)
		.then(res => {
			api.setTenantId(res.json.id);
			next();
		})
		.catch(() => {
			next();
		});
};

export default beforeRendering;
