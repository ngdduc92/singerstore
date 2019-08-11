import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import PersonalInfo from './personalInfo';
import utils from '../../../../src/shopfront/shared/lib/utils';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: utils.decrypt(
				new URLSearchParams(props.location.search).get('id')
			)
		};
	}

	componentDidMount() {
		this.props.fetchUser(this.state.userId);
	}

	handlePersonalInfoSubmit = values => {
		const userData = {
			full_name: values.full_name,
			email: values.email,
			phone: values.phone,
			country: values.country,
			state: values.state,
			city: values.city,
			address1: values.address1,
			address2: values.address2
		};
		this.props.updateUser(this.state.userId, userData);
	};

	render() {
		const { user } = this.props.state;

		const {
			checkoutInputClass = 'checkout-field',
			checkoutButtonClass = 'checkout-button'
		} = themeSettings;

		return (
			<div className="checkout-form">
				<PersonalInfo
					title={text.myProfile}
					inputClassName={checkoutInputClass}
					buttonClassName={checkoutButtonClass}
					initialValues={user}
					onSubmit={this.handlePersonalInfoSubmit}
				/>
			</div>
		);
	}
}
