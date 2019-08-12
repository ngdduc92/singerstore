import React from 'react';
import ImageUpload from 'modules/shared/imageUpload';
import Paper from 'material-ui/Paper';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default class GeneralLogoSettingsForm extends React.Component {
	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { onImageUpload, onImageDelete, settings } = this.props;
		let imageUrl = settings && settings.logo ? settings.logo : '';
		const allowEdit = userScopes.includes(scopes.WRITE_GENERAL_SETTINGS);
		return (
			<Paper className="paper-box" zDepth={1}>
				<div style={{ padding: 30 }}>
					<ImageUpload
						uploading={false}
						imageUrl={imageUrl}
						onDelete={allowEdit ? onImageDelete : null}
						onUpload={allowEdit ? onImageUpload : () => {}}
					/>
				</div>
			</Paper>
		);
	}
}
