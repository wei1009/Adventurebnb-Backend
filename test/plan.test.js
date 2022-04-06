"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const plan = require("../models/plan.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUsersIds,
  testUserPlanIds
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("remove", function () {
    test("if it works", async function () {
        const username="u1";
      await plan.removePlan(username,testUserPlanIds[0]);
      const res = await db.query(
          "DELETE FROM user_plan WHERE id=$1", [testUserPlanIds[0]]);
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such plan", async function () {
      try {
        await plan.removePlan(username, 0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError);
      }
    });
  
  
  });