import React from 'react';
import messages from 'lib/text';
import TenantGeneral from './general';

class TenantEditContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.fetchData();
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
				<TenantGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTenant, cancelTenantEdit } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		tenant: state.tenants.editTenant
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchData: () => {
			const { tenantId } = ownProps.match.params;
			dispatch(fetchTenant(tenantId));
		},
		eraseData: () => {
			dispatch(cancelTenantEdit());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TenantEditContainer)
);
