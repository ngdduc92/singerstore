import React, { Fragment } from 'react';
import messages from 'lib/text';
import GroupSelect from 'modules/customerGroups/select';
import DeleteConfirmation from 'modules/shared/deleteConfirmation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Search from './search';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groupId: null,
			openSetGroup: false,
			openDelete: false
		};
	}

	showSetGroup = () => {
		this.setState({ openSetGroup: true });
	};

	showDelete = () => {
		this.setState({ openDelete: true });
	};

	closeSetGroup = () => {
		this.setState({ openSetGroup: false });
	};

	closeDelete = () => {
		this.setState({ openDelete: false });
	};

	deleteCustomers = () => {
		this.setState({ openDelete: false });
		this.props.onDelete();
	};

	saveSetGroup = () => {
		this.setState({ openSetGroup: false });
		this.props.onSetGroup(this.state.groupId);
	};

	selectSetGroup = groupId => {
		this.setState({ groupId: groupId });
	};

	render() {
		const { search, setSearch, selectedCount } = this.props;

		const actionsSetGroup = [
			<FlatButton
				label={messages.cancel}
				onClick={this.closeSetGroup}
				style={{ marginRight: 10 }}
			/>,
			<FlatButton
				label={messages.save}
				primary={true}
				keyboardFocused={true}
				onClick={this.saveSetGroup}
			/>
		];

		return (
			<span>
				<Search value={search} setSearch={setSearch} />
				{selectedCount > 0 && (
					<span>
						{userScopes.includes(scopes.DELETE_CUSTOMER) && (
							<Fragment>
								<IconButton
									touch={true}
									tooltipPosition="bottom-left"
									tooltip={messages.actions_delete}
									onClick={this.showDelete}
								>
									<FontIcon color="#fff" className="material-icons">
										delete
									</FontIcon>
								</IconButton>
								<DeleteConfirmation
									open={this.state.openDelete}
									isSingle={false}
									itemsCount={selectedCount}
									onCancel={this.closeDelete}
									onDelete={this.deleteCustomers}
								/>
							</Fragment>
						)}
						{userScopes.includes(scopes.WRITE_CUSTOMER) && (
							<Fragment>
								<IconButton
									touch={true}
									tooltipPosition="bottom-left"
									tooltip={messages.customers_setGroup}
									onClick={this.showSetGroup}
								>
									<FontIcon color="#fff" className="material-icons">
										folder
									</FontIcon>
								</IconButton>
								<Dialog
									title={messages.customers_setGroup}
									actions={actionsSetGroup}
									modal={false}
									open={this.state.openSetGroup}
									onRequestClose={this.closeSetGroup}
									autoScrollBodyContent={true}
								>
									<GroupSelect
										onSelect={this.selectSetGroup}
										selectedId={this.state.groupId}
										showRoot={true}
										showAll={false}
									/>
								</Dialog>
							</Fragment>
						)}
					</span>
				)}
			</span>
		);
	}
}
