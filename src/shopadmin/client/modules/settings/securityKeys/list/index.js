import { connect } from 'react-redux';
import { fetchApiKeys } from '../../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		apiKeys: state.settings.apiKeys
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchApiKeys());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
