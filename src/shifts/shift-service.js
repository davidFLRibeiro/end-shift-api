const shiftService = {
  getAllShifts(knex) {
    return knex.select('*').from('shift');
  },

  insertShift(knex, newShift) {
    return knex
      .insert(newShift)
      .into('shift')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('shift')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteShift(knex, id) {
    return knex('shift')
      .where({ id })
      .delete();
  },

  updateShift(knex, id, newShiftFields) {
    return knex('shift')
      .where({ id })
      .update(newShiftFields);
  }
};

module.exports = shiftService;
