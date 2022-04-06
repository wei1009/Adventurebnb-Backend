"use strict";

/** Routes for user plan. */

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const Plan = require("../models/plan");
const db = require("../db");
const router = express.Router();

/** POST /[username] 
 *
 * Returns { "saved": req.body.description }
 *
 * Authorization required: same-user-as-:username
 * */
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const plan = await Plan.savePlan(req.params.username, req.body);
    return res.json({ saved: req.body.description });
  } catch (err) {
    return res.status(err.status).send(err.message);
  }
});

/** GET /[username]/plan 
*   
* Authorization required: same-user-as-:username
* */
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  const preCheck = await db.query(
    `SELECT id
           FROM users
           WHERE username = $1`, [req.params.username]);
  const user = preCheck.rows[0];
  if (!user) throw new NotFoundError(`No user: ${req.params.username}`);
  try {
    const results = await db.query(
      `SELECT 
              a.id, 
              a.username,
              b.id as user_plan_id, 
              b.create_date, 
              b.checkout_date, 
              b.checkin_date, 
              b.room_description, 
              b.guest_adult, 
              b.guest_children, 
              b.status, 
              c.name,
              c.street1,
              c.city,
              c.state,
              c.zip
            FROM users a 
            JOIN user_plan b ON a.id = b.user_id 
            JOIN hotel c ON b.hotel_code=c.code 
            WHERE a.id=${user.id}
            ORDER BY b.checkin_date`);
    return res.json(results.rows);
  }
  catch (err) {
    return res.status(err.status).send(err.message);
  }
})

/** DELETE /[username] { planId } => { planId }
 *
 * Data all plan
 * Authorization required: admin or same-user-as-:username
 **/
router.delete("/:username/:planId", ensureCorrectUser, async function (req, res, next) {
  try {

    const plan = await Plan.removePlan(req.params.username, req.params.planId);
    return res.json({ plan });
  } catch (err) {
    return res.status(err.status).send(err.message);
  }
});

/** PATCH /[username] { planId } => { planId }
 *
 * Update plan status
 * 
 * Authorization required: admin or same-user-as-:username
 **/
router.patch("/:username/:planId", ensureCorrectUser, async function (req, res, next) {
  try {
    debugger;
    const plan = await Plan.updatePlan(req.params.username, req.params.planId, req.body);
    return res.json({ plan });
  } catch (err) {
    return res.status(err.status).send(err.message);
  }
});

module.exports = router;