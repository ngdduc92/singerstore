import React from 'react';
import Paper from 'material-ui/Paper';
import messages from 'lib/text';
import style from './style.css';

const ResetPasswordSuccess = () => {
	return (
		<Paper className={style.resetPasswordSuccessBox}>
			{messages.resetPasswordSuccess}
		</Paper>
	);
};

export default ResetPasswordSuccess;
