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
			<div className="col-xs-3">{messages.tenants_name}</div>
			<div className="col-xs-3">{messages.tenants_email}</div>
			<div className="col-xs-5">{messages.tenants_address}</div>
		</div>
	</Subheader>
);

export default Head;
