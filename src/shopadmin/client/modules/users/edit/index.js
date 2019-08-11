import React from 'react';
import messages from 'lib/text';
import UserGeneral from './general';

class UserEditContainer extends React.Component {
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
					{messages.users_info}
				</div>
				<UserGeneral />
			</div>
		);
	}
}

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchUser, cancelUserEdit } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.users.editUser
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchData: () => {
			const { userId } = ownProps.match.params;
			dispatch(fetchUser(userId));
		},
		eraseData: () => {
			dispatch(cancelUserEdit());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(UserEditContainer)
);
