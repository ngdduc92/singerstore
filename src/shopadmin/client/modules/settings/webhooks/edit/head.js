import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteWebhook } from '../../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		webhook: state.settings.webhookEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: webhookId => {
			dispatch(deleteWebhook(webhookId));
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(
				`/${tenantUrlName}/${locale}/admin/settings/webhooks`
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
