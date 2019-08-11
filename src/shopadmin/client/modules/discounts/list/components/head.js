import React from 'react';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text';

const Head = ({ onSelectAll }) => (
	<Subheader style={{ paddingRight: 16 }}>
		<div className="row middle-xs">
			<div className="col-xs-1">
				<Checkbox
					onCheck={(event, isInputChecked) => {
						onSelectAll(isInputChecked);
					}}
				/>
			</div>
			<div className="col-xs-5">{messages.discounts_code}</div>
			<div className="col-xs-3">{messages.discounts_type}</div>
			<div className="col-xs-3">{messages.discounts_amount}</div>
		</div>
	</Subheader>
);

export default Head;
