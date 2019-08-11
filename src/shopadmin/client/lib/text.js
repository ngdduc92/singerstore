import en from '../../../../locales/en.json';
import vi from '../../../../locales/vi.json';

const getText = (locale) => {
    switch (locale) {
        case 'us':
            return en;
        case 'vn':
            return vi;
        default:
            return en;
    }
}
const text = getText(location.pathname.split('/')[2]);
export default text;
