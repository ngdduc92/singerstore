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

	deletePage = () => {
		this.setState({ openDelete: false });
		this.props.onDelete(this.props.page.id);
	};

	render() {
		const { page } = this.props;
		const pageName =
			page && page.meta_title && page.meta_title.length > 0
				? page.meta_title
				: 'Draft';
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		if (page) {
			return (
				<Fragment>
					{userScopes.includes(scopes.DELETE_PAGE) && (
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
								itemName={pageName}
								onCancel={this.closeDelete}
								onDelete={this.deletePage}
							/>
						</Fragment>
					)}
					{page.enabled && (
						<a href={`/${tenantUrlName}/${locale}${page.path}`} target="_blank">
							<IconButton
								touch={true}
								tooltipPosition="bottom-left"
								tooltip={messages.viewOnWebsite}
							>
								<FontIcon color="#fff" className="material-icons">
									open_in_new
								</FontIcon>
							</IconButton>
						</a>
					)}
				</Fragment>
			);
		} else {
			return null;
		}
	}
}
