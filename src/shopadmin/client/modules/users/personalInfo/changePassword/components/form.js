import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import messages from 'lib/text';
import style from './style.css';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
	const errors = {};
	if (values['new_password'] !== values['confirm_password']) {
		errors['confirm_password'] = messages.errors_confirm_password;
	}

	return errors;
};

const UserChangePasswordForm = ({
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
							type="password"
							name="new_password"
							component={TextField}
							floatingLabelText={messages.new_password}
							fullWidth={true}
						/>
						<Field
							type="password"
							name="confirm_password"
							component={TextField}
							floatingLabelText={messages.confirm_password}
							fullWidth={true}
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
	form: 'UserChangePasswordForm',
	validate,
	enableReinitialize: true
})(UserChangePasswordForm);
