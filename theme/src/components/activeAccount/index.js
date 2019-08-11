import React from 'react';
import ActiveAccountSuccess from './activeAccountSuccess';
import ActiveAccountError from './activeAccountError';
import ActiveLinkInvalid from './activeLinkInvalid';

export default class ActiveAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirmPassword: '',
			responseMessage: null
		};
	}

	componentDidMount() {
		this.props.activeAccount();
	}

	handlePasswordChange = event => {
		this.setState({
			password: event.target.value
		});
	};

	handleConfirmPasswordChange = event => {
		this.setState({
			confirmPassword: event.target.value
		});
	};

	render() {
		const { activeAccount } = this.props.state;
		if (activeAccount) {
			if (activeAccount.isSuccess) {
				return <ActiveAccountSuccess />;
			} else {
				if (activeAccount.isToken) {
					return <ActiveAccountError />;
				} else {
					return <ActiveLinkInvalid />;
				}
			}
		} else {
			return null;
		}
	}
}
