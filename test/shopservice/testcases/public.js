import supertest from 'supertest';
import settings from '../../../config/server';
import 'should';

const server = supertest.agent('http://localhost:3001/api');

describe('Public', () => {
	describe('getTenantIdByUrlName', () => {
		it('should get tenant id', done => {
			server
				.set('x-access-key', settings.apiKey)
				.get('/v1/p/tenants/vintage')
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.id.should.equal('5cf5d544d6092a10bc3cff83');
					done();
				});
		});
	});

	describe('Register', () => {
		it('should register', done => {
			server
				.set('x-access-key', settings.apiKey)
				.set('x-tenant-id', '5cf5d544d6092a10bc3cff83')
				.post('/v1/p/register')
				.send({ email: 'test@gmail.com', password: '123456' })
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.sent.should.equal(true);
					done();
				});
		});
	});
});
