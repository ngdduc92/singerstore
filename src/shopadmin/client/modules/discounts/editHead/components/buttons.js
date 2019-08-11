import React from 'react';
import messages from 'lib/text';
import DeleteConfirmation from 'modules/shared/deleteConfirmation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';
const Fragment = React.Fragment;

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openDelete: false
		};
	}

	openDelete = () => {
		this.setState({ openDelete: true });
	};

	closeDelete = () => {
		this.setState({ openDelete: false });
	};

	handleDelete = () => {
		this.closeDelete();
		this.props.onDelete();
	};

	render() {
		const { discount } = this.props;
		const discountCode =
			discount && discount.code && discount.code.length > 0
				? discount.code
				: 'Draft';

		return (
			userScopes.includes(scopes.DELETE_DISCOUNT) && (
				<Fragment>
					<IconButton
						touch={true}
						tooltipPosition="bottom-left"
						tooltip={messages.deleteDiscount}
						onClick={this.openDelete}
					>
						<FontIcon color="#fff" className="material-icons">
							delete
						</FontIcon>
					</IconButton>
					<DeleteConfirmation
						open={this.state.openDelete}
						isSingle={true}
						itemsCount={1}
						itemName={discountCode}
						onCancel={this.closeDelete}
						onDelete={this.handleDelete}
					/>
				</Fragment>
			)
		);
	}
}
