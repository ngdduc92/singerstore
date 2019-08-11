import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text, tenantUrlName, locale } from '../../lib/settings';

class HeadMenuItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isActive: false
		};
	}

	onMouseEnterHandler = () => {
		if (!this.props.isMobile) {
			this.setState({
				isActive: true
			});
		}
	};

	onMouseLeaveHandler = () => {
		if (!this.props.isMobile) {
			this.setState({
				isActive: false
			});
		}
	};

	isActiveToggle = () =>
		this.setState({
			isActive: !this.state.isActive
		});

	render() {
		const { categories, category, onClick, level, isMobile } = this.props;
		const items = categories
			.filter(item => item.parent_id === category.id)
			.map((subcategory, index) => (
				<HeadMenuItem
					key={index}
					category={subcategory}
					onClick={onClick}
					categories={categories}
					level={level + 1}
					isMobile={isMobile}
					tenantUrlName={tenantUrlName}
				/>
			));
		const hasItems = items.length > 0;

		return (
			<div
				onMouseEnter={this.onMouseEnterHandler}
				onMouseLeave={this.onMouseLeaveHandler}
				onMouseUp={this.onMouseLeaveHandler}
				className={
					'cat-level-' +
					level +
					(this.state.isActive ? ' is-active' : '') +
					(hasItems ? ' has-items' : '')
				}
			>
				<div
					className={'cat-label-' + level}
					onClick={() =>
						location.replace(`/${tenantUrlName}/${locale}${category.path}`)
					}
				>
					<NavLink
						activeClassName="is-active"
						className={hasItems ? 'has-items' : ''}
						to={`/${tenantUrlName}/${locale}${category.path}`}
						onClick={onClick}
					>
						{category.name}
					</NavLink>
					{hasItems && isMobile && <span onClick={this.isActiveToggle} />}
				</div>
				{hasItems && (
					<div className={' nav-level-' + (level + 1)}>
						{level === 0 && !isMobile ? (
							<div className="sub-cat">
								<div className="sub-cat-title">
									<span>{text.categories}</span>
								</div>
								<div className="sub-cat-content">{items}</div>
							</div>
						) : (
							items
						)}
					</div>
				)}
			</div>
		);
	}
}

export default class HeadMenu extends React.PureComponent {
	render() {
		const { categories, onClick, isMobile } = this.props;
		let addItemsToMenu = [];
		if (themeSettings.header_menu && themeSettings.header_menu.length > 0) {
			addItemsToMenu = themeSettings.header_menu.map(item => ({
				name: item.text,
				path: `/${tenantUrlName}/${locale}${item.url}`,
				id: item.id || '',
				parent_id: item.parent_id || null
			}));
		}
		const menuItems = [...categories, ...addItemsToMenu];
		const items = menuItems
			.filter(category => category.parent_id === null)
			.map((category, index) => (
				<HeadMenuItem
					key={index}
					category={category}
					onClick={onClick}
					categories={categories}
					level={0}
					isMobile={isMobile}
				/>
			));

		return <div className="nav-level-0">{items}</div>;
	}
}
