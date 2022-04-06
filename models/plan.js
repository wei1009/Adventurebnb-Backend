"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

//   /** Apply for job: update db, returns undefined.
//    *
//    * - username: username applying for job
//    * - jobId: job id
//    **/
class Plan {
    static async savePlan(username, userPlan) {
        const hotelCode = userPlan.hotelCode;
        const adult = userPlan.adult;
        const children = userPlan.children;
        const description = userPlan.description;
        const checkInDate = userPlan.checkInDate;
        const checkOutDate = userPlan.checkOutDate;
        const status = userPlan.status;
        let date = new Date();
        let currentDate = date.toISOString().split('T')[0];

        const preCheck = await db.query(
            `SELECT id
           FROM users
           WHERE username = $1`, [username]);
        const user = preCheck.rows[0];
        if (!user) throw new NotFoundError(`No user: ${username}`);

        const preCheck2 = await db.query(
            `SELECT name
           FROM hotel
           WHERE code = $1`, [hotelCode]);
        const hotel = preCheck2.rows[0];

        if (!hotel) throw new NotFoundError(`No hotel: ${hotel}`);

        await db.query(
            `INSERT INTO  user_plan 
                        (user_id,
                         hotel_code,
                         create_date,
                         checkin_date, 
                         checkout_date,
                         room_description,
                         guest_adult,
                         guest_children,
                         status)
      VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9)`,
            [user.id, hotelCode, currentDate, checkInDate, checkOutDate, description, adult, children, status]
        )
    }

    //remove user's plan from database
    static async removePlan(username, userPlan) {
        let result = await db.query(
            `DELETE
             FROM user_plan
             WHERE id = $1
            RETURNING room_description`,
            [userPlan],
        );
        const userPlanCode = result.rows[0];
        if (!userPlanCode) throw new NotFoundError(` ${username} has no plan!`);
    }


    static async updatePlan(username, userPlan, status) {
        const { setCols, values } = sqlForPartialUpdate(
            status,
            {
                status: "status",
            });
        const handleVarIdx = "$" + (values.length + 1);

        const querySql =
            `Update user_plan
             Set  ${setCols}
            WHERE id = ${handleVarIdx} 
            RETURNING status`;
        const result = await db.query(querySql, [...values, userPlan]);
        const userPlanCode = result.rows[0];
        if (!userPlanCode) throw new NotFoundError(` ${username} has no plan!`);
    }
}

module.exports = Plan;