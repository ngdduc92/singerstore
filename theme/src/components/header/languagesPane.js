import React from 'react';
import * as helper from '../../lib/helper';
import { themeSettings, text, tenantUrlName } from '../../lib/settings';

const LanguageItem = ({ src, country, language, onClick }) => (
	<div className="item" onClick={onClick}>
		<div className="image">
			<img src={src} className="icon" alt={country} title={country} />
		</div>
		<div className="name">
			<h3 className="country">{country}</h3>
			<small className="language">{language}</small>
		</div>
	</div>
);

export default class LanguagesPane extends React.Component {
	constructor(props) {
		super(props);
	}

	changeLanguage = country => {
		const locale = helper.getLocale(country);
		location.replace(`/${tenantUrlName}/${locale}/`);
	};
	render() {
		return (
			<div className="languages">
				<img
					src="/assets/images/close-black.svg"
					className="icon"
					alt={text.close}
					title={text.close}
					className="close-button"
					onClick={this.props.languagesToggle}
				/>
				<div className="menu-container">
					<h2 className="title">
						<span>Select your Location</span>
					</h2>
					<div className="group">
						<h4 className="header">Americas</h4>
						<div className="body">
							<LanguageItem
								src={helper.getCountryImageUrl('United State')}
								country="United State"
								language={helper.getLanguage('United State')}
								onClick={this.changeLanguage.bind(this, 'United State')}
							/>
						</div>
					</div>
					<div className="group">
						<h4 className="header">Asia Pacific</h4>
						<div className="body">
							<LanguageItem
								src={helper.getCountryImageUrl('Vietnam')}
								country="Vietnam"
								language={helper.getLanguage('Vietnam')}
								onClick={this.changeLanguage.bind(this, 'Vietnam')}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
