import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import messages from 'lib/text';
import style from './style.css';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { CustomToggle } from 'modules/shared/form';

const validate = values => {
	const errors = {};
	const requiredFields = ['name', 'url_name', 'email'];

	requiredFields.map(field => {
		if (values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

const TenantGeneralForm = ({
	handleSubmit,
	pristine,
	reset,
	submitting,
	initialValues
}) => {
	if (initialValues) {
		return (
			<form onSubmit={handleSubmit}>
				<Paper className="paper-box" zDepth={1}>
					<div className={style.innerBox}>
						<Field
							name="name"
							component={TextField}
							floatingLabelText={messages.tenants_name + ' *'}
							fullWidth={true}
						/>
						<Field
							name="url_name"
							component={TextField}
							floatingLabelText={messages.tenants_url_name}
							fullWidth={true}
							readOnly={true}
						/>
						<Field
							type="email"
							name="email"
							component={TextField}
							floatingLabelText={messages.tenants_email}
							fullWidth={true}
						/>
						<Field
							name="address"
							component={TextField}
							floatingLabelText={messages.tenants_address}
							fullWidth={true}
						/>
						<Field
							name="tel"
							component={TextField}
							floatingLabelText={messages.tenants_tel}
							fullWidth={true}
						/>
						<Field
							component={CustomToggle}
							name="enabled"
							label={messages.enabled}
							style={{ paddingTop: 16, paddingBottom: 16 }}
						/>
					</div>
					<div
						className={
							'buttons-box ' +
							(pristine ? 'buttons-box-pristine' : 'buttons-box-show')
						}
					>
						<FlatButton
							label={messages.cancel}
							className={style.button}
							onClick={reset}
							disabled={pristine || submitting}
						/>
						<RaisedButton
							type="submit"
							label={messages.save}
							primary={true}
							className={style.button}
							disabled={pristine || submitting}
						/>
					</div>
				</Paper>
			</form>
		);
	} else {
		return null;
	}
};

export default reduxForm({
	form: 'TenantGeneralForm',
	validate,
	enableReinitialize: true
})(TenantGeneralForm);
