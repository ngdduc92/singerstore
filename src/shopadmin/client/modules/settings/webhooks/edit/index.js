import { connect } from 'react-redux';
import {
	fetchWebhook,
	updateWebhook,
	createWebhook,
	receiveWebhook
} from '../../actions';
import Form from './components/form';

const mapStateToProps = (state, ownProps) => {
	const { webhookId } = ownProps.match.params;
	return {
		webhookId: webhookId,
		initialValues: state.settings.webhookEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			const { webhookId } = ownProps.match.params;
			if (webhookId) {
				dispatch(fetchWebhook(webhookId));
			} else {
				dispatch(receiveWebhook({ enabled: true }));
			}
		},
		onSubmit: webhook => {
			if (webhook.id) {
				dispatch(updateWebhook(webhook));
			} else {
				dispatch(createWebhook(webhook));
				const tenantUrlName = localStorage.getItem('tenant_url_name');
				const locale = location.pathname.split('/')[2];
				ownProps.history.push(
					`/${tenantUrlName}/${locale}/admin/settings/webhooks`
				);
			}
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
