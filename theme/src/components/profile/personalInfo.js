import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { themeSettings, text } from '../../lib/settings';
import InputField from '../inputField';
import validation from '../validation';

class PersonalInfo extends React.Component {
	constructor(props) {
		super(props);
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
						name="full_name"
						component={InputField}
						type="text"
						label={text.fullName}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="email"
						component={InputField}
						type="email"
						label={text.email}
						validate={[validation.required, validation.email]}
					/>
					<Field
						className={inputClassName}
						name="phone"
						component={InputField}
						type="tel"
						label={text.mobile}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="country"
						component={InputField}
						type="text"
						label={text.country}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="state"
						component={InputField}
						type="text"
						label={text.state}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="city"
						component={InputField}
						type="text"
						label={text.city}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="address1"
						component={InputField}
						type="text"
						label={text.address1}
						validate={[validation.required]}
					/>
					<Field
						className={inputClassName}
						name="address2"
						component={InputField}
						type="text"
						label={text.address2}
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
	form: 'PersonalInfo',
	enableReinitialize: true
})(PersonalInfo);
