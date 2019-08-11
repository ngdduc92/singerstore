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
		const { product } = this.props;
		const productName =
			product && product.name && product.name.length > 0
				? product.name
				: 'Draft';
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		return (
			<Fragment>
				{userScopes.includes(scopes.DELETE_PRODUCT) && (
					<Fragment>
						<IconButton
							touch={true}
							tooltipPosition="bottom-left"
							tooltip={messages.deleteProduct}
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
							itemName={productName}
							onCancel={this.closeDelete}
							onDelete={this.handleDelete}
						/>
					</Fragment>
				)}
				{product && product.enabled && (
					<a
						href={`/${tenantUrlName}/${locale}${product.path}`}
						target="_blank"
					>
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
	}
}
