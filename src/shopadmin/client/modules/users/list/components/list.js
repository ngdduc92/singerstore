import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head';
import UsersListItem from './item';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text';
import style from './style.css';
import Paper from 'material-ui/Paper';

export default class UsersList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const {
			items,
			selected,
			loadingItems,
			onSelect,
			onSelectAll,
			selectedAll,
			loadMore,
			settings,
			hasMore,
			totalCount
		} = this.props;

		const rows = items.map((item, index) => {
			const itemSelected = selected.includes(item.id);
			return (
				<UsersListItem
					key={index}
					user={item}
					selected={itemSelected}
					onSelect={onSelect}
					settings={settings}
				/>
			);
		});

		return (
			<Paper className="paper-box" zDepth={1}>
				<div style={{ width: '100%' }}>
					<List>
						<Head onSelectAll={onSelectAll} />
						<Divider />
						{rows}
						<div className={style.more}>
							<RaisedButton
								disabled={loadingItems || !hasMore}
								label={messages.actions_loadMore}
								labelPosition="before"
								primary={false}
								icon={<FontIcon className="material-icons">refresh</FontIcon>}
								onClick={loadMore}
							/>
						</div>
					</List>
				</div>
			</Paper>
		);
	}
}
