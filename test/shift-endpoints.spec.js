const knex = require('knex');
const app = require('../src/app');
const { makeShiftArray } = require('./shift.fixtures');

describe('shift Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect fom db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE shift'));

  afterEach('cleanup', () => db.raw('TRUNCATE shift'));

  describe(`GET /api/shifts`, () => {
    context(`given no folders`, () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get('/api/shifts')
          .expect(200, []);
      });
    });
  });
});
