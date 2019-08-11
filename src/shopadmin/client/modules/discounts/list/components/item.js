import React from 'react';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import messages from 'lib/text';
import * as helper from 'lib/helper';
import style from './style.css';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import { types_array } from 'lib/discountTypes';

const DiscountItem = ({ discount, onSelect, selected, settings }) => {
	let discountClass = style.discountCode;
	if (discount.enabled) {
		discountClass += ' ' + style.discountActive;
	} else {
		discountClass += ' ' + style.discountInactive;
	}

	const discountCode =
		discount.code && discount.code.length > 0
			? discount.code
			: `<${messages.draft}>`;
	const tenantUrlName = location.pathname.split('/')[1];
	const locale = location.pathname.split('/')[2];
	return (
		<div className={'discounts-item' + (selected === true ? ' selected' : '')}>
			<ListItem
				style={{ cursor: 'normal' }}
				primaryText={
					<div className="row middle-xs">
						<div className="col-xs-1">
							<Checkbox
								checked={selected}
								onCheck={(event, isInputChecked) => {
									onSelect(discount.id, isInputChecked);
								}}
							/>
						</div>
						<div className="col-xs-5">
							<Link
								to={`/${tenantUrlName}/${locale}/admin/discounts/${
									discount.id
								}`}
								className={discountClass}
							>
								{discountCode}
							</Link>
						</div>
						<div className={'col-xs-3'}>
							{helper.getTypeLabel(discount.type, types_array)}
						</div>
						<div className={'col-xs-3'}>{discount.amount}</div>
					</div>
				}
			/>
			<Divider />
		</div>
	);
};

export default DiscountItem;
