import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import BarChart from './barChart';
import * as utils from './utils';
import moment from 'moment';
import roles from 'lib/roles';
import * as helper from 'lib/helper';

export default class OrdersBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ordersData: {},
			salesData: {}
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		const filter = {
			draft: false,
			cancelled: false,
			date_placed_min: moment()
				.subtract(1, 'months')
				.hour(0)
				.minute(0)
				.second(0)
				.toISOString()
		};

		api.orders
			.list(filter)
			.then(({ status, json }) => {
				const role = localStorage.getItem('role');
				const seller =
					role === roles.SELLER ? localStorage.getItem('email') : null;
				const orders = {};
				orders.data = json.data.filter(order => {
					order = helper.filterItemsBySeller(order, seller);
					return order.items && order.items.length > 0;
				});
				const reportData = utils.getReportDataFromOrders(orders);
				const ordersData = utils.getOrdersDataFromReportData(reportData);
				const salesData = utils.getSalesDataFromReportData(reportData);
				this.setState({ ordersData, salesData });
			})
			.catch(error => {
				console.log(error);
			});
	};

	render() {
		const { ordersData, salesData } = this.state;
		return (
			<div>
				<BarChart
					data={ordersData}
					legendDisplay={true}
					title={messages.drawer_orders}
				/>
				<BarChart
					data={salesData}
					legendDisplay={false}
					title={messages.salesReport}
				/>
			</div>
		);
	}
}
