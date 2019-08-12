import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, SelectField } from 'redux-form-material-ui';
import messages from 'lib/text';
import style from './style.css';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { CustomToggle } from 'modules/shared/form';
import RoleMenuItems from 'modules/shared/roleMenuItems';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

class UserGeneralForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			role: null
		};
	}

	onRoleChange = role => {
		this.setState({
			role: role
		});
	};

	render() {
		let {
			handleSubmit,
			pristine,
			reset,
			submitting,
			initialValues
		} = this.props;
		if (initialValues) {
			return (
				<form onSubmit={handleSubmit}>
					<Paper className="paper-box" zDepth={1}>
						<div className={style.innerBox}>
							<Field
								name="full_name"
								component={TextField}
								floatingLabelText={messages.fullName}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								type="email"
								name="email"
								component={TextField}
								floatingLabelText={messages.users_email}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="phone"
								component={TextField}
								floatingLabelText={messages.phone}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="country"
								component={TextField}
								floatingLabelText={messages.country}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="state"
								component={TextField}
								floatingLabelText={messages.state}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="city"
								component={TextField}
								floatingLabelText={messages.city}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="address1"
								component={TextField}
								floatingLabelText={messages.address1}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								name="address2"
								component={TextField}
								floatingLabelText={messages.address2}
								fullWidth={true}
								readOnly={true}
							/>
							<Field
								component={SelectField}
								autoWidth={true}
								fullWidth={true}
								name="role"
								floatingLabelFixed={true}
								floatingLabelText={messages.users_role}
								onChange={(event, currentValue, prevValue) => {
									this.onRoleChange(currentValue);
								}}
							>
								{RoleMenuItems}
							</Field>
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
								disabled={
									!userScopes.includes(scopes.WRITE_USER) ||
									pristine ||
									submitting
								}
							/>
						</div>
					</Paper>
				</form>
			);
		} else {
			return null;
		}
	}
}

export default reduxForm({
	form: 'UserGeneralForm',
	enableReinitialize: true
})(UserGeneralForm);
