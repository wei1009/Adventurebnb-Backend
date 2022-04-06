const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUsersIds = [];

const testUserPlanIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM hotel");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query(`
    INSERT INTO hotel(code, name, street1, city, state, zip, image)
    VALUES (72285, 'HYATT PLACE LAS VEGAS', '4520 PARADISE RD', 'LAS VEGAS', 'NV', '89169', 'https://photos.hotelbeds.com/giata/07/072285/072285a_hb_a_001.jpg'),
            (72286, 'GUESTHOUSE ANCHORAGE INN', '321 EAST 5TH AVENUE', 'ANCHORAGE', 'AK', '99501', 'https://photos.hotelbeds.com/giata/07/072286/072286a_hb_a_001.jpg'),
            (72387, 'GRAND SIERRA RESORT & CASINO', '2500 E 2ND ST', 'RENO', 'NV', '89595', NULL)`);

  const userIdResult = await db.query(`
            INSERT INTO users(username,
                              password,
                              first_name,
                              last_name,
                              email)
            VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
                   ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
            RETURNING id`, [await bcrypt.hash("password1", BCRYPT_WORK_FACTOR), await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)]);

  testUsersIds.splice(0, 0, ...userIdResult.rows.map(r => r.id));

  const PlanIdResult = await db.query(`
    INSERT INTO user_plan (user_id,
                           hotel_code, 
                           create_date, 
                           checkin_date, 
                           checkout_date,
                           room_description,
                           guest_adult,
                           guest_children,
                           status)
    VALUES ($1, 6747, '2022-03-13', '2022-03-14', '2022-03-15', 'FAMILY ROOM STANDARD', 3, 1, 'pending'),
            ($1, 586515, '2022-03-14', '2022-03-17', '2022-03-20', 'Room STANDARD', 5, 1, 'completed'),
            ($1, 107247, '2022-03-17', '2022-04-13', '2022-04-14', 'CHALET DELUXE TWO BEDS', 3, 0, 'pending')
          RETURNING id`, [testUsersIds[0]]);
          testUserPlanIds.splice(0, 0, ...PlanIdResult.rows.map(r => r.id));

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUsersIds,
  testUserPlanIds
};