import * as t from './actionTypes';

const initialState = {
	resetPassword: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.RESET_PASSWORD_REQUEST:
			return Object.assign({}, state, {});
		case t.RESET_PASSWORD_RECEIVE:
			return Object.assign({}, state, {
				resetPassword: action.item
			});
		default:
			return state;
	}
};
