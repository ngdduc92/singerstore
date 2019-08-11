import { text } from '../lib/settings';

export const required = value =>
	value && value.length > 0 ? undefined : text.required;

export const email = value =>
	value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
		? text.emailInvalid
		: undefined;

export default {
	required: required,
	email: email
};
