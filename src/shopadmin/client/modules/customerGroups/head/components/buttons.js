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

	showDelete = () => {
		this.setState({ openDelete: true });
	};

	closeDelete = () => {
		this.setState({ openDelete: false });
	};

	deleteGroup = () => {
		this.setState({ openDelete: false });
		this.props.onDelete(this.props.selected.id);
	};

	render() {
		const { selected, onCreate } = this.props;
		const groupName =
			selected && selected.name && selected.name.length > 0
				? selected.name
				: 'Draft';

		return (
			<span>
				{selected && userScopes.includes(scopes.DELETE_CUSTOMER_GROUP) && (
					<Fragment>
						<IconButton
							touch={true}
							tooltip={messages.actions_delete}
							tooltipPosition="bottom-left"
							onClick={this.showDelete}
						>
							<FontIcon color="#fff" className="material-icons">
								delete
							</FontIcon>
						</IconButton>
						<DeleteConfirmation
							open={this.state.openDelete}
							isSingle={true}
							itemsCount={1}
							itemName={groupName}
							onCancel={this.closeDelete}
							onDelete={this.deleteGroup}
						/>
					</Fragment>
				)}
				{userScopes.includes(scopes.WRITE_CUSTOMER_GROUP) && (
					<IconButton
						touch={true}
						tooltipPosition="bottom-left"
						tooltip={messages.customerGroups_titleAdd}
						onClick={onCreate}
					>
						<FontIcon color="#fff" className="material-icons">
							add
						</FontIcon>
					</IconButton>
				)}
			</span>
		);
	}
}
