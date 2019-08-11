import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { themeSettings, text } from '../../lib/settings';
import InputField from '../inputField';
import validation from '../validation';

class ChangePasswordForm extends React.Component {
	constructor(props) {
		super(props);
	}

	passwordsMustMatch(value, allValues) {
		return value !== allValues.newPassword
			? 'Passwords do not match'
			: undefined;
	}

	render() {
		const {
			handleSubmit,
			pristine,
			invalid,
			valid,
			reset,
			submitting,
			initialValues,
			inputClassName,
			buttonClassName,
			title
		} = this.props;
		return (
			<div className="checkout-step">
				<h1>{title}</h1>
				<form onSubmit={handleSubmit}>
					<Field
						className={inputClassName}
						name="newPassword"
						type="password"
						component={InputField}
						label={text.newPassword}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="confirmPassword"
						type="password"
						component={InputField}
						label={text.confirmPassword}
						validate={[validation.required, this.passwordsMustMatch]}
					/>
					<div className="checkout-button-wrap">
						<button
							type="submit"
							disabled={invalid || pristine || submitting}
							className={buttonClassName}
						>
							{text.update}
						</button>
					</div>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'ChangePasswordForm',
	enableReinitialize: true
})(ChangePasswordForm);
