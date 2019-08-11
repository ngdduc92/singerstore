import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head';
import DiscountsListItem from './item';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text';
import style from './style.css';
import Paper from 'material-ui/Paper';

export default class DiscountsList extends React.Component {
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
			totalCount,
			types
		} = this.props;

		const rows = items.map((item, index) => {
			const itemSelected = selected.includes(item.id);
			return (
				<DiscountsListItem
					key={index}
					discount={item}
					selected={itemSelected}
					onSelect={onSelect}
					settings={settings}
					types={types}
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
