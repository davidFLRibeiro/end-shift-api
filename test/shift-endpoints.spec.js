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
    context(`folders in the database`, () => {
      const testShift = makeShiftArray();

      beforeEach(`insert shift`, () => {
        return db
          .into('shift')
          .insert(testShift)
          .then(() => {
            return db.into('shift');
          });
      });
      it('responds with 200 and all of shifts', () => {
        return supertest(app)
          .get('/api/shifts')
          .expect(200, testShift);
      });
    });
  });
  describe(`GET /api/shifts/:shifts_id`, () => {
    context(`Given no shifts`, () => {
      it(`responds 404 no shifts`, () => {
        const shiftId = 9999;
        return supertest(app)
          .get(`/api/shifts/${shiftId}`)
          .expect(404, { error: { message: `shift doesnt exist` } });
      });
    });

    context('Given there are shifts in the database', () => {
      const testShifts = makeShiftArray();

      beforeEach('insert shifts', () => {
        return db
          .into('shift')
          .insert(testShifts)
          .then(() => {
            return db.into('shift');
          });
      });

      it('responds withh 200 and specified shift', () => {
        const shiftId = 2;
        const expectedShift = testShifts[shiftId - 1];
        return supertest(app)
          .get(`/api/shifts/${shiftId}`)
          .expect(200, expectedShift);
      });
    });
  });
  describe(`POST /api/shifts`, () => {
    const testShifts = makeShiftArray();
    beforeEach('insert shift', () => {
      return db.into('shift').insert(testShifts);
    });
  });

  describe.only(`DELETE /api/shifts/:shift_id`, () => {
    context(`Given no shifts`, () => {
      it(`responds with 404`, () => {
        const shiftId = 9999;
        return supertest(app)
          .delete(`/api/shifts/${shiftId}`)
          .expect(404, { error: { message: `shift doesnt exist` } });
      });
    });
    context(`Given there are shifts in the database`, () => {
      const testShift = makeShiftArray();

      beforeEach('insert shift', () => {
        return db
          .into('shift')
          .insert(testShift)
          .then(() => {
            return db.into('shift');
          });
      });
      it('responds with 204 and removes the shift', () => {
        const idToRemove = 2;
        expectedShift = testShift.filter(shift => shift.id !== idToRemove);
        return supertest(app)
          .delete(`/api/shifts/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/shifts`)
              .expect(expectedShift)
          );
      });
    });
  });
});
