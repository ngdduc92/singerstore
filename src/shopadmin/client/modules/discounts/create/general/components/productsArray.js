import React from 'react';
import { Link } from 'react-router-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { TextField, SelectField } from 'redux-form-material-ui';
import api from 'lib/api';
import * as helper from 'lib/helper';
import messages from 'lib/text';
import style from './style.css';
import ProductSearchDialog from 'modules/shared/productSearch';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { CustomToggle } from 'modules/shared/form';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const ProductShort = ({
	id,
	name,
	thumbnailUrl,
	priceFormatted,
	enabled,
	discontinued,
	actions
}) => (
	<div
		className={
			style.relatedProduct +
			(enabled === false || discontinued === true
				? ' ' + style.relatedProductDisabled
				: '')
		}
	>
		<div className={style.relatedProductImage}>
			{thumbnailUrl && thumbnailUrl !== '' && <img src={thumbnailUrl} />}
		</div>
		<div className={style.relatedProductText}>
			<Link
				to={`/${localStorage.getItem('tenant_url_name')}/${
					location.pathname.split('/')[2]
				}/admin/products/${id}`}
			>
				{name}
			</Link>
			<br />
			<div>{priceFormatted}</div>
		</div>
		<div className={style.relatedProductActions}>{actions}</div>
	</div>
);

const RelatedProductActions = ({ fields, index }) => (
	<IconMenu
		targetOrigin={{ horizontal: 'right', vertical: 'top' }}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
		iconButtonElement={
			<IconButton touch={true}>
				<FontIcon color="#777" className="material-icons">
					more_vert
				</FontIcon>
			</IconButton>
		}
	>
		<MenuItem
			primaryText={messages.actions_delete}
			onClick={() => fields.remove(index)}
		/>
		{index > 0 && (
			<MenuItem
				primaryText={messages.actions_moveUp}
				onClick={() => fields.move(index, index - 1)}
			/>
		)}
		{index + 1 < fields.length && (
			<MenuItem
				primaryText={messages.actions_moveDown}
				onClick={() => fields.move(index, index + 1)}
			/>
		)}
	</IconMenu>
);

const RelatedProduct = ({ settings, product, actions }) => {
	if (product) {
		const priceFormatted = helper.formatCurrency(product.price, settings);
		const imageUrl =
			product && product.images.length > 0 ? product.images[0].url : null;
		const thumbnailUrl = helper.getThumbnailUrl(imageUrl, 100);
		return (
			<ProductShort
				id={product.id}
				name={product.name}
				thumbnailUrl={thumbnailUrl}
				priceFormatted={priceFormatted}
				enabled={product.enabled}
				discontinued={product.discontinued}
				actions={actions}
			/>
		);
	} else {
		// product doesn't exist
		return (
			<ProductShort
				id="-"
				name=""
				thumbnailUrl=""
				priceFormatted=""
				actions={actions}
			/>
		);
	}
};

export default class ProductsArray extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddItem: false,
			products: []
		};
	}

	showAddItem = () => {
		this.setState({ showAddItem: true });
	};

	hideAddItem = () => {
		this.setState({ showAddItem: false });
	};

	addItem = productId => {
		this.hideAddItem();
		const currentIds = this.props.fields.getAll();
		if (productId != null) {
			if (currentIds && Array.isArray(currentIds) && currentIds.length > 0) {
				if (!currentIds.includes(productId)) {
					this.props.fields.push(productId);
				}
			} else {
				this.props.fields.push(productId);
			}
		}
	};

	componentDidMount() {
		const ids = this.props.fields.getAll();
		this.fetchProducts(ids);
	}

	componentWillReceiveProps(nextProps) {
		const currentIds = this.props.fields.getAll();
		const newIds = nextProps.fields.getAll();

		if (currentIds !== newIds) {
			this.fetchProducts(newIds);
		}
	}

	fetchProducts = ids => {
		if (ids && Array.isArray(ids) && ids.length > 0) {
			api.products
				.list({
					limit: 50,
					fields:
						'id,name,enabled,discontinued,price,on_sale,regular_price,images',
					ids: ids
				})
				.then(productsResponse => {
					this.setState({ products: productsResponse.json.data });
				});
		} else {
			this.setState({
				products: []
			});
		}
	};

	render() {
		const {
			settings,
			fields,
			meta: { touched, error, submitFailed }
		} = this.props;
		const { products } = this.state;

		return (
			<div>
				<Paper className={style.relatedProducts} zDepth={1}>
					{fields.map((field, index) => {
						const actions = (
							<RelatedProductActions fields={fields} index={index} />
						);
						const productId = fields.get(index);
						const product = products.find(item => item.id === productId);
						return (
							<RelatedProduct
								key={index}
								settings={settings}
								product={product}
								actions={actions}
							/>
						);
					})}

					<ProductSearchDialog
						open={this.state.showAddItem}
						title={messages.addOrderItem}
						settings={settings}
						onSubmit={this.addItem}
						onCancel={this.hideAddItem}
						submitLabel={messages.add}
						cancelLabel={messages.cancel}
					/>
				</Paper>

				<div>
					<RaisedButton
						label={messages.addOrderItem}
						onClick={this.showAddItem}
					/>
				</div>
			</div>
		);
	}
}
