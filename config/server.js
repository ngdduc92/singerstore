// config used by server side only
const dbHost = process.env.DB_HOST || '';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbCred =
	dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : '';

const dbUrl =
	process.env.DB_URL ||
	`mongodb+srv://singerstore:singerstore@singerstore-rew3a.mongodb.net/singerstore?retryWrites=true&w=majority` ||
	`mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}`;

module.exports = {
	// used by Store (server side)
	apiBaseUrl: `http://localhost:3001/api`,

	// Access-Control-Allow-Origin
	shopBaseUrl: 'http://localhost:3000',

	// used by shopfront
	dftDashboardUrlname: 'dashboard',
	dftShopfrontUrlname: 'vintage',
	dftLanguageAndRegion: 'us',

	apiListenPort: 3001,
	shopListenPort: 3000,

	// used by API
	mongodbServerUrl: dbUrl,

	smtpServer: {
		host: '',
		port: 0,
		secure: true,
		user: '',
		pass: '',
		fromName: '',
		fromAddress: ''
	},

	apiKey:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZDJmZTgyODAxZTY5ZTBhYzE2OWFlOWQiLCJhcHBfaWQiOiJlc2hvcC41ZDJmZTgyODAxZTY5ZTBhYzE2OWFlOWQiLCJpYXQiOjE1NjM0OTczNTd9.cCbj9k-RmPOaOlX8Hyd9T7YxupH1ux1uFvOE1xaXSQE',

	// key to sign tokens and apikeys
	jwtSecretKey: 'NP69kXFR3znRi7kL8Max2GTB24wOtEQM',

	// key to sign shopfront cookies
	cookieSecretKey: '8669X9P5yI1DAEthy1chc3M9EncyS7SM',

	cryptoSecretKey: '8669X9P5yI1DAEthy1chc3M9EncyS7SM',

	smtpPassword: 'Test123456@',

	ownerPassword: '123456',

	// path to uploads
	categoriesUploadPath: 'images/categories',
	productsUploadPath: 'images/products',
	logosUploadPath: 'images/logos',
	filesUploadPath: 'files',
	uploadPath: 'public/content',

	// url to uploads
	categoriesUploadUrl: 'images/categories',
	productsUploadUrl: 'images/products',
	logosUploadUrl: 'images/logos',

	// used by API
	orderStartNumber: 1000,

	storeAccessKeysToDatabase: true
};
