import React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const MethodItem = ({ method }) => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	const listItem = (
		<ListItem
			rightIcon={
				<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
			}
			style={!method.enabled ? { color: 'rgba(0, 0, 0, 0.3)' } : {}}
			primaryText={
				<div className="row">
					<div className="col-xs-6">{method.name}</div>
					<div className="col-xs-6" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
						{method.description}
					</div>
				</div>
			}
		/>
	);
	return (
		<div>
			<Divider />
			{userScopes.includes(scopes.READ_SHIPPING_METHOD) ? (
				<Link
					to={`/${tenantUrlName}/${locale}/admin/settings/shipping/${method.id}`}
					style={{ textDecoration: 'none' }}
				>
					{listItem}
				</Link>
			) : (
				listItem
			)}
		</div>
	);
};

export default class EmailSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { shippingMethods } = this.props;
		let methods = shippingMethods.map((method, index) => (
			<MethodItem key={index} method={method} />
		));

		return (
			<Paper className="paper-box" zDepth={1}>
				<div style={{ width: '100%' }}>
					<List style={{ padding: 0 }}>{methods}</List>
				</div>
			</Paper>
		);
	}
}
