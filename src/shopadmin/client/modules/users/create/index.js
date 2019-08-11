import React from 'react';
import messages from 'lib/text';
import UserCreateGeneral from 'modules/users/create/general';

class UserCreateContainer extends React.Component {
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
					{messages.users_info}
				</div>
				<UserCreateGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { cancelUserCreate } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.users.createUser
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		eraseData: () => {
			dispatch(cancelUserCreate());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(UserCreateContainer)
);
