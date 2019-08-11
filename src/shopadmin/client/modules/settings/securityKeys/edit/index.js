import { connect } from 'react-redux';
import {
	fetchApiKey,
	updateApiKey,
	createApiKey,
	receiveApiKey,
	deleteApiKey
} from '../../actions';
import Form from './components/form';

const mapStateToProps = (state, ownProps) => {
	const { apiKeyId } = ownProps.match.params;
	return {
		apiKeyId: apiKeyId,
		initialValues: state.settings.apiKeyEdit,
		newApiKey: state.settings.newApiKey
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			const { apiKeyId } = ownProps.match.params;
			if (apiKeyId) {
				dispatch(fetchApiKey(apiKeyId));
			} else {
				dispatch(receiveApiKey({}));
			}
		},
		onSubmit: apiKey => {
			if (apiKey.id) {
				dispatch(updateApiKey(apiKey));
			} else {
				dispatch(createApiKey(apiKey));
			}
		},
		onDelete: () => {
			const { apiKeyId } = ownProps.match.params;
			dispatch(deleteApiKey(apiKeyId));
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(
				`/${tenantUrlName}/${locale}/admin/settings/apikeys`
			);
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
