import React from 'react';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text';

const Head = ({ onSelectAll }) => (
	<Subheader>
		<div className="row row--no-gutter middle-xs">
			<div className="col-xs-6 col--no-gutter">
				<div className="row row--no-gutter middle-xs">
					<div className="col-xs-1 col--no-gutter">
						<Checkbox
							onCheck={(event, isInputChecked) => {
								onSelectAll(isInputChecked);
							}}
						/>
					</div>
					<div className="col-xs-11">{messages.products_name}</div>
				</div>
			</div>
			<div className="col-xs-2 col--no-gutter">{messages.products_sku}</div>
			<div className="col-xs-2 col--no-gutter">{messages.products_stock}</div>
			<div
				className="col-xs-2 col--no-gutter"
				style={{ textAlign: 'right', paddingRight: 23 }}
			>
				{messages.products_price}
			</div>
		</div>
	</Subheader>
);

export default Head;
