import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

const ApiKeyItem = ({ apiKey }) => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return (
		<div>
			<Divider />
			<Link
				to={`/${tenantUrlName}/${locale}/admin/settings/apikeys/${apiKey.id}`}
				style={{ textDecoration: 'none' }}
			>
				<ListItem
					rightIcon={
						<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
					}
					primaryText={
						<div className="row">
							<div className="col-xs-6">{apiKey.app_id}</div>
							<div className="col-xs-6" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
								{apiKey.app_name}
							</div>
						</div>
					}
				/>
			</Link>
		</div>
	);
};

export default class ApiKeysList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { apiKeys } = this.props;
		let listItems = apiKeys.map((apiKey, index) => (
			<ApiKeyItem key={index} apiKey={apiKey} />
		));

		return (
			<div>
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_apiKeyHelp}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>{listItems}</List>
					</div>
				</Paper>
			</div>
		);
	}
}
