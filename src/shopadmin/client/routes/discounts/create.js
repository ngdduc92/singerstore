import React from 'react';
import DiscountCreate from 'modules/discounts/create';

const DiscountNew = props => {
	return (
		<div className="row row--no-gutter col-full-height scroll">
			<div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2">
				<DiscountCreate />
			</div>
		</div>
	);
};

export default DiscountNew;
