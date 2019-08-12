import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import messages from 'lib/text';
import style from './style.css';
import ConfirmationDialog from 'modules/shared/confirmation';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const validate = values => {
	const errors = {};
	const requiredFields = ['app_id', 'app_name', 'email'];

	requiredFields.map(field => {
		if (!values.is_system && values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

const normalizeAppId = value => {
	return (
		value &&
		value
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/&/g, '-and-') // Replace & with 'and'
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\-\-+/g, '-')
	); // Replace multiple - with single -
};

const email = value => {
	return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
		? messages.errors_email
		: undefined;
};

class EditApiKeyForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showRevokeDialog: false
		};
	}

	handleRevoke = () => {
		this.setState({ showRevokeDialog: true });
	};

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		let {
			handleSubmit,
			pristine,
			submitting,
			initialValues,
			apiKeyId,
			newApiKey,
			onDelete
		} = this.props;
		const isApiKeyAdded = !!newApiKey;
		const isAdd = apiKeyId === null || apiKeyId === undefined;

		return (
			<div>
				<form onSubmit={handleSubmit}>
					<Paper className="paper-box" zDepth={1}>
						<div className={style.innerBox}>
							<Field
								name="app_id"
								component={TextField}
								floatingLabelText={messages.settings_appId}
								fullWidth={true}
								disabled={!isAdd}
								normalize={normalizeAppId}
							/>
							<p className="field-hint">{messages.settings_appIdHelp}</p>
							<Field
								name="app_name"
								component={TextField}
								floatingLabelText={messages.settings_appName}
								fullWidth={true}
							/>
							<Field
								name="email"
								component={TextField}
								floatingLabelText={messages.email}
								fullWidth={true}
								disabled={!isAdd}
								type="email"
								validate={email}
							/>
						</div>
						<div className="buttons-box">
							{!isAdd && (
								<RaisedButton
									label={messages.settings_revokeAccess}
									secondary={true}
									style={{ float: 'left' }}
									onClick={this.handleRevoke}
									disabled={!userScopes.includes(scopes.WRITE_API_KEY)}
								/>
							)}
							<RaisedButton
								type="submit"
								label={isAdd ? messages.settings_generateApiKey : messages.save}
								primary={true}
								className={style.button}
								disabled={
									!userScopes.includes(scopes.WRITE_API_KEY) ||
									pristine ||
									submitting
								}
							/>
						</div>
					</Paper>
				</form>

				<ConfirmationDialog
					open={isApiKeyAdded}
					title={messages.settings_copyYourNewApiKey}
					description={newApiKey}
					submitLabel={messages.actions_done}
					cancelLabel={messages.cancel}
					modal={true}
				/>

				<ConfirmationDialog
					open={this.state.showRevokeDialog}
					title={messages.settings_apiKeyRevokeTitle}
					description={messages.settings_apiKeyRevokeDescription}
					onSubmit={onDelete}
					submitLabel={messages.settings_revokeAccess}
					cancelLabel={messages.cancel}
				/>
			</div>
		);
	}
}

export default reduxForm({
	form: 'EditApiKeyForm',
	validate,
	enableReinitialize: true
})(EditApiKeyForm);
