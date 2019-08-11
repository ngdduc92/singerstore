import React from 'react';
import api from 'lib/api';
import ImageUpload from 'modules/shared/imageUpload';

export default class ThemeImageUpload extends React.Component {
	constructor(props) {
		super(props);
	}

	onDelete = () => {
		const filePath = this.props.input.value;
		const fileNameArr = filePath.split('/');
		const fileName = fileNameArr[fileNameArr.length - 1];
		api.theme.assets.deleteFile(fileName).then(() => {
			this.props.input.onChange('');
		});
	};

	onUpload = formData => {
		api.theme.assets.uploadFile(formData).then(({ status, json }) => {
			const filePath = json.file;
			this.props.input.onChange(filePath);
		});
	};

	render() {
		let { input, label } = this.props;
		const imageUrl = input.value && input.value.length > 0 ? input.value : null;

		return (
			<div>
				<p>{label}</p>
				<ImageUpload
					uploading={false}
					imageUrl={imageUrl}
					onDelete={this.onDelete}
					onUpload={this.onUpload}
				/>
			</div>
		);
	}
}
