import * as t from './actionTypes';
import api from 'lib/api';
import utils from '../../../../shopfront/shared/lib/utils';

function requestResetPassword() {
	return {
		type: t.RESET_PASSWORD_REQUEST
	};
}

function receiveResetPassword(item) {
	return {
		type: t.RESET_PASSWORD_RECEIVE,
		item
	};
}

export function resetPassword(data) {
	return async (dispatch, getState) => {
		dispatch(requestResetPassword());
		let res = null;
		const urlParams = new URLSearchParams(location.search);
		const tokenId = utils.decrypt(urlParams.get('token'));
		const pApi = api.public;
		const tokenResponse = await pApi.getVerificationTokenById(tokenId);
		if (isTokenValid(tokenResponse.json)) {
			const userResponse = await pApi.updateUserPassword(
				tokenResponse.json.user_id,
				data
			);
			if (userResponse.status === 200) {
				pApi.disableVerificationToken(tokenId);
				res = { isSuccess: true, isToken: true };
			} else {
				res = { isSuccess: false, isToken: true };
			}
		} else {
			res = { isSuccess: false, isToken: false };
		}

		dispatch(receiveResetPassword(res));
	};
}

const isTokenValid = token => {
	if (token) {
		const expiration_date =
			new Date(token.date_created).getTime() + 24 * 60 * 60 * 1000;
		return token.enabled && expiration_date > Date.now();
	} else {
		return false;
	}
};
