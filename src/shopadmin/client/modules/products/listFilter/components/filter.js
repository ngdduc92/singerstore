import React, { Fragment } from 'react';
import messages from 'lib/text';
import style from './style.css';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import roles from 'lib/roles';

export default class Filter extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		localStorage.getItem('role') === roles.ADMINISTRATOR
			? this.props.fetchSellers()
			: null;
	}

	render() {
		const {
			enabled,
			discontinued,
			onSale,
			stockStatus,
			seller
		} = this.props.filter;
		const role = localStorage.getItem('role');
		const email = localStorage.getItem('email');
		return (
			<div className={style.filter}>
				<SelectField
					value={enabled}
					onChange={(event, index, value) => {
						this.props.setEnabled(value);
					}}
					floatingLabelText={messages.enabled}
					fullWidth={true}
				>
					<MenuItem value={null} primaryText={messages.all} label=" " />
					<MenuItem value={false} primaryText={messages.no} />
					<MenuItem value={true} primaryText={messages.yes} />
				</SelectField>

				<SelectField
					value={discontinued}
					onChange={(event, index, value) => {
						this.props.setDiscontinued(value);
					}}
					floatingLabelText={messages.products_discontinued}
					fullWidth={true}
				>
					<MenuItem value={null} primaryText={messages.all} label=" " />
					<MenuItem value={false} primaryText={messages.no} />
					<MenuItem value={true} primaryText={messages.yes} />
				</SelectField>

				<SelectField
					value={onSale}
					onChange={(event, index, value) => {
						this.props.setOnSale(value);
					}}
					floatingLabelText={messages.products_onSale}
					fullWidth={true}
				>
					<MenuItem value={null} primaryText={messages.all} label=" " />
					<MenuItem value={false} primaryText={messages.no} />
					<MenuItem value={true} primaryText={messages.yes} />
				</SelectField>

				<SelectField
					value={stockStatus}
					onChange={(event, index, value) => {
						this.props.setStock(value);
					}}
					floatingLabelText={messages.products_stockStatus}
					fullWidth={true}
				>
					<MenuItem value={null} primaryText={messages.all} label=" " />
					<MenuItem
						value={'available'}
						primaryText={messages.products_inStock}
					/>
					<MenuItem
						value={'out_of_stock'}
						primaryText={messages.products_outOfStock}
					/>
					<MenuItem
						value={'backorder'}
						primaryText={messages.products_backorder}
					/>
					<MenuItem
						value={'preorder'}
						primaryText={messages.products_preorder}
					/>
					<MenuItem
						value={'discontinued'}
						primaryText={messages.products_discontinued}
					/>
				</SelectField>

				{role === roles.SELLER ? (
					<SelectField
						value={seller}
						onChange={(event, index, value) => {
							this.props.setSeller(value);
						}}
						floatingLabelText={messages.products_seller}
						fullWidth={true}
					>
						<MenuItem value={seller} primaryText={seller} />
					</SelectField>
				) : (
					<SelectField
						value={seller}
						onChange={(event, index, value) => {
							this.props.setSeller(value);
						}}
						floatingLabelText={messages.products_seller}
						fullWidth={true}
					>
						<MenuItem value={null} primaryText={messages.all} label=" " />
						<MenuItem value={email} primaryText={email} label={email} />
						{this.props.sellers.map((item, i) => (
							<MenuItem value={item.email} primaryText={item.email} key={i} />
						))}
					</SelectField>
				)}
			</div>
		);
	}
}
