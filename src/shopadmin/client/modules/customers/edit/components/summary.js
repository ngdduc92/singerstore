import React from 'react';
import messages from 'lib/text';
import * as helper from 'lib/helper';
import style from './style.css';
import SummaryForm from './summaryForm.js';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default class CustomerSummary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openSummaryEdit: false
		};
	}

	showSummaryEdit = () => {
		this.setState({ openSummaryEdit: true });
	};

	hideSummaryEdit = () => {
		this.setState({ openSummaryEdit: false });
	};

	saveSummaryEdit = customer => {
		this.props.onCustomerSummaryUpdate(customer);
		this.hideSummaryEdit();
	};

	render() {
		const { customer, settings } = this.props;
		const totalSpent = helper.formatCurrency(customer.total_spent, settings);
		const allowEdit = userScopes.includes(scopes.WRITE_CUSTOMER);
		return (
			<Paper className="paper-box" zDepth={1}>
				<div className={style.innerBox}>
					<div
						className={style.customerName}
						style={{ paddingBottom: 26, paddingTop: 0 }}
					>
						{customer.full_name}
						<div>
							<small>{customer.group_name}</small>
						</div>
					</div>

					<div className={style.summaryRow + ' row'}>
						<div className="col-xs-5">
							<span>{messages.email}</span>
						</div>
						<div className="col-xs-7">
							<a href={'MailTo:' + customer.email} className={style.link}>
								{customer.email}
							</a>
						</div>
					</div>

					<div className={style.summaryRow + ' row'}>
						<div className="col-xs-5">
							<span>{messages.mobile}</span>
						</div>
						<div className="col-xs-7">{customer.mobile}</div>
					</div>

					<div className={style.summaryRow + ' row'}>
						<div className="col-xs-5">
							<span>{messages.customers_totalSpent}</span>
						</div>
						<div className="col-xs-7">{totalSpent}</div>
					</div>

					<div className={style.summaryRow + ' row'}>
						<div className="col-xs-5">
							<span>{messages.note}</span>
						</div>
						<div className="col-xs-7">{customer.note}</div>
					</div>

					{allowEdit && (
						<div style={{ marginTop: 20 }}>
							<RaisedButton
								label="Edit"
								style={{ marginRight: 15 }}
								onClick={this.showSummaryEdit}
							/>
						</div>
					)}

					<Dialog
						title={messages.customers_titleEdit}
						modal={false}
						open={this.state.openSummaryEdit}
						onRequestClose={this.hideSummaryEdit}
						contentStyle={{ width: 600 }}
					>
						<SummaryForm
							initialValues={customer}
							onCancel={this.hideSummaryEdit}
							onSubmit={this.saveSummaryEdit}
						/>
					</Dialog>
				</div>
			</Paper>
		);
	}
}
