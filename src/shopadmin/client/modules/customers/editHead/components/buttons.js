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

	deleteOrder = () => {
		this.closeDelete();
		this.props.onDelete();
	};

	render() {
		const { customer } = this.props;
		const customerName =
			customer && customer.full_name && customer.full_name.length > 0
				? customer.full_name
				: 'Draft';

		return (
			userScopes.includes(scopes.DELETE_CUSTOMER) && (
				<Fragment>
					<IconButton
						touch={true}
						tooltipPosition="bottom-left"
						tooltip={messages.actions_delete}
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
						itemName={customerName}
						onCancel={this.closeDelete}
						onDelete={this.props.onDelete}
					/>
				</Fragment>
			)
		);
	}
}
