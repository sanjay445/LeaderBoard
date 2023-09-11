const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(express.json());
//Establish the database connection

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12645177",
  password: "rNTYKznren",
  database: "sql12645177",
});
db.connect(function (error) {
  if (error) {
    console.log("Error Connecting to DB");
  } else {
    console.log("successfully Connected to DB");
  }
});

//Establish the Port

server.listen(3306, function check(error) {
  if (error) {
    console.log("Error Occured");
  } else {
    console.log("Server is listening to the  port : 3306");
  }
});

/**
 * @description Get the Activity Records
 * @author Sanjay S
 */

server.post("/getActivities", (req, res) => {
  let skip = req.body.params.skip;
  let limit = req.body.params.limit;
  var sql = `SELECT * FROM m_activity LIMIT ${skip},${limit}`;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

/**
 * @description Update the Activity Records
 * @param {number} id
 * @author Sanjay S
 */

server.post("/updateActivities", (req, res) => {
  var params = req.body.params;
  var sql = `UPDATE m_activity SET ? WHERE id = ${params.id}`;
  db.query(sql, params, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      res.send({ status: true, msg: "Data updated successfully" });
    }
  });
});

/**
 * @description Add new Activity Record
 * @param {string} name
 * @param {string} description
 * @param {number} points
 * @author Sanjay S
 */

server.post("/addActivity", (req, res) => {
  let params = [
    req.body?.params?.name ? JSON.stringify(req.body?.params?.name) : "",
    req.body?.params?.description
      ? JSON.stringify(req.body?.params?.description)
      : "",
    req.body?.params?.points ? parseInt(req.body?.params?.points) : "",
  ];
  var sql = `INSERT into m_activity(name, description, points) values (${params})`;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      res.send({ status: true, msg: "Data inserted successfully" });
    }
  });
});

/**
 * @description Delete the Activity Record
 * @param {number} id
 * @author Sanjay S
 */

server.post("/deleteActivity", (req, res) => {
  let sql = `DELETE FROM m_activity WHERE id=${req.body.params}`;
  let query = db.query(sql, (error) => {
    if (error) {
      res.send({ status: false, message: error });
    } else {
      res.send({
        status: true,
        message: `Activity record : ${req.body.id} Deleted successfully`,
      });
    }
  });
});

/**
 * @description Get the Activity list of an Employee
 * @param {string} associate_id
 * @author Sanjay S
 */

server.post("/getEmployeeActivityDetails", (req, res) => {
  let skip = req.body.params?.skip;
  let limit = req.body.params?.limit;
  let associate_id = req.body.params?.associate_id;
  var sql = `SELECT te.id, te.associate_id, me.name, te.date, ta.points, ta.employee_activity_id, ta.activity_name FROM 
  t_employee te LEFT JOIN m_employee me ON te.associate_id = me.associate_id  AND me.is_active = 1\
  LEFT JOIN t_activity ta on ta.employee_activity_id = te.employee_activity_id AND ta.is_active = 1 \
  WHERE te.associate_id = ${associate_id} AND te.is_active = 1`;

  if (req.body?.params?.start_date && req.body?.params?.end_date) {
    let start_date = JSON.stringify(req.body.params?.start_date);
    let end_date = JSON.stringify(req.body.params?.end_date);
    sql += ` AND date>= ${start_date} AND date<= ${end_date}`;
  }
  sql += ` LIMIT ${skip},${limit}`;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

/**
 * @description Get the Employee list based on rank
 * @param {date} start_date
 * @param {date} end_date
 * @author Sanjay S
 */

server.post("/getEmployeesRankWise", (req, res) => {
  let skip = req.body.params?.skip;
  let limit = req.body.params?.limit;
  var sql =
    "SELECT te.associate_id, me.name, mr.name as role, SUM(ta.points) as total_points FROM t_employee te\
   LEFT JOIN t_activity ta on te.employee_activity_id = ta.employee_activity_id AND ta.is_active = 1\
   LEFT JOIN m_employee me on te.associate_id = me.associate_id AND me.is_active = 1\
   LEFT JOIN m_role mr on me.role_id = mr.id AND mr.is_active = 1\
    WHERE te.is_active = 1";

  if (req.body?.params?.start_date && req.body?.params?.end_date) {
    let start_date = JSON.stringify(req.body?.params?.start_date);
    let end_date = JSON.stringify(req.body?.params?.end_date);
    sql += ` AND te.date BETWEEN ${start_date} AND ${end_date}`;
  }

  sql += ` GROUP BY te.associate_id ORDER BY total_points DESC LIMIT ${skip},${limit}`;
  console.log(sql);
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB", error);
      res.send({ status: false, msg: error });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

/**
 * @description Authentication
 * @param {string} email
 * @param {string} password
 * @author Sanjay S
 */

server.post("/onLogin", (req, res) => {
  let email = JSON.stringify(req.body.params.email);
  let password = JSON.stringify(req.body.params.password);
  console.log(email, password);
  var sql = `SELECT mr.id as role_id, mr.name as role, me.associate_id, me.name as employee_name FROM m_login ml  \
  INNER JOIN m_employee me on me.associate_id = ml.associate_id and me.is_active = 1 \
  INNER JOIN m_role mr on mr.id = me.role_id and mr.is_active = 1\
  WHERE ml.email = ${email} AND ml.password = ${password} AND ml.is_active = 1\
  `;
  db.query(sql, function (error, result) {
    if (result) {
      res.send({ status: true, data: result });
    } else {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    }
  });
});

/**
 * @description Add new Activity Record for an employee
 * @param {string} name
 * @param {string} description
 * @param {number} points
 * @author Sanjay S
 */

server.post("/addEmployeeActivity", (req, res) => {
  let activity_name = JSON.stringify(req.body.params.activity_name);
  let points = JSON.parse(req.body.params.points);
  let t_activity_params = [activity_name, points];
  var insertActivity = `INSERT into t_activity(activity_name, points) values (${t_activity_params})`;
  db.query(insertActivity, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      res.send({
        status: true,
        data: "Inserted employee activity details successfully",
      });
    }
  });
});

/**
 * @description Add employee data
 * @param {string} name
 * @param {string} description
 * @param {number} points
 * @author Sanjay S
 */

server.post("/addEmployee", (req, res) => {
  let aid = req.body.associate_id;

  var newActivity = `SELECT * from t_activity ORDER BY employee_activity_id DESC LIMIT 1`;
  db.query(newActivity, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
      res.send({ status: false, msg: error });
    } else {
      let params = [aid, result[0].employee_activity_id];
      var insertEmployee = `INSERT into t_employee(associate_id,employee_activity_id) values (${params})`;
      db.query(insertEmployee, function (error, result) {
        if (error) {
          console.log("Error Connecting to DB");
          res.send({ status: false, msg: error });
        } else {
          res.send({
            status: true,
            msg: "Employee details inserted successfully !",
          });
        }
      });
    }
  });
});
