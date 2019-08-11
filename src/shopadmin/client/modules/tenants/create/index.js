import React from 'react';
import messages from 'lib/text';
import TenantCreateGeneral from 'modules/tenants/create/general';

class TenantCreateContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillUnmount() {
		this.props.eraseData();
	}

	render() {
		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.tenants_info}
				</div>
				<TenantCreateGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { cancelTenantCreate } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		tenant: state.tenants.createTenant
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		eraseData: () => {
			dispatch(cancelTenantCreate());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TenantCreateContainer)
);
