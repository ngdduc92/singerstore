import React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const PageItem = ({ page }) => {
	const tags = page.tags && page.tags.length > 0 ? page.tags.join(', ') : '';
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	const listItem = (
		<ListItem
			rightIcon={
				<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
			}
			style={!page.enabled ? { color: 'rgba(0, 0, 0, 0.3)' } : {}}
			primaryText={
				<div className="row">
					<div className="col-xs-8">{page.meta_title}</div>
					<div className="col-xs-4" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
						{tags}
					</div>
				</div>
			}
		/>
	);
	return (
		<div>
			<Divider />
			{userScopes.includes(scopes.READ_PAGE) ? (
				<Link
					to={`/${tenantUrlName}/${locale}/admin/pages/${page.id}`}
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

export default class PagesList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { pages } = this.props;
		let listItems = pages.map((page, index) => (
			<PageItem key={index} page={page} />
		));

		return (
			<Paper className="paper-box" zDepth={1}>
				<div style={{ width: '100%' }}>
					<List style={{ padding: 0 }}>{listItems}</List>
				</div>
			</Paper>
		);
	}
}
