import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deletePage } from '../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		page: state.pages.pageEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: id => {
			dispatch(deletePage(id));
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(`/${tenantUrlName}/${locale}/admin/pages`);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
