const express = require('express');
//const xss = require('xss');
const shiftService = require('./shift-service');
const path = require('path');
const shiftRouter = express.Router();
const jsonParser = express.json();

shiftRouter
  .route('/')
  .get((req, res, next) => {
    shiftService
      .getAllShifts(req.app.get('db'))
      .then(shifts => {
        res.json(shifts);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      cupping,
      vault_money,
      shift_money,
      jetwash,
      galp_fleet,
      local_credit,
      affractions,
      discount_card,
      discount,
      intern_consumption,
      devolutions,
      escapes,
      resume_genesis,
      atm,
      visa
    } = req.body;
    const newShift = {
      cupping,
      vault_money,
      shift_money,
      jetwash,
      galp_fleet,
      local_credit,
      affractions,
      discount_card,
      discount,
      intern_consumption,
      devolutions,
      escapes,
      resume_genesis,
      atm,
      visa
    };

    for (const [key, value] of Object.entries(newShift))
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request vody` }
        });
      }
    shiftService
      .insertShift(req.app.get('db'), newShift)
      .then(shift => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${shift.id}`))
          .json(shift);
      })
      .catch(next);
  });

shiftRouter
  .route('/:shift_id')
  .all((req, res, next) => {
    shiftService
      .getById(req.app.get('db'), req.params.shift_id)
      .then(shift => {
        if (!shift) {
          return res.status(404).json({
            error: { message: `shift doesnt exist` }
          });
        }
        res.shift = shift;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.shift);
  })
  .delete((req, res, next) => {
    shiftService
      .deleteShift(req.app.get('db'), req.params.shift_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      cupping,
      vault_money,
      shift_money,
      jetwash,
      galp_fleet,
      local_credit,
      affractions,
      discount_card,
      discount,
      intern_consumption,
      devolutions,
      escapes,
      resume_genesis,
      atm,
      visa,
      date_created
    } = req.body;
    const shiftToUpdate = {
      cupping,
      vault_money,
      shift_money,
      jetwash,
      galp_fleet,
      local_credit,
      affractions,
      discount_card,
      discount,
      intern_consumption,
      devolutions,
      escapes,
      resume_genesis,
      atm,
      visa,
      date_created
    };

    const numberOfValues = Object.values(shiftToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain fields`
        }
      });
    }
    shiftService
      .updateShift(req.app.get('db'), req.params.shift_id, shiftToUpdate)
      .then(numRowsAffected => {
        res
          .location(path.posix.join(req.originalUrl, `${req.params.shift_id}`))
          .status(204)
          .end();
      })
      .catch(next);
  });

module.exports = shiftRouter;
