import express from "express";
import { conn } from "../connectdb";
import { UserPostRequest } from "../model/userPostRequest";
import mysql from "mysql";
import util from "util";
import multer from "multer";
import path from "path";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../filebase_con";
import { storage } from "../filebase_con";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Users", (err, result, fields) => {
    res.json(result);
  });
});


router.get("/idx", (req, res) => {
  // conn.query("select * from Users where id = " + req.query.id, (err, result, fields)=>{
  //   res.json(result);
  // })
  if (req.query.id) {
    conn.query(
      "select * from Users where id = " + req.query.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  } else {
    res.send("call get in Users with Query Param " + req.query.id);
  }
  //   res.json("this is Users page")
});


router.post("/",(req, res) => {
  //upload รูปภาพลง firebase
  //เก็บข้อมูลลง database
  let user: UserPostRequest = req.body;
  let sql =
    "INSERT INTO `Users`(`name`, `email`, `password`,`picture`,`role`) VALUES (?,?,?,?,?)";

  sql = mysql.format(sql, [
    user.name,
    user.email,
    user.password,
    user.picture,
    user.role,
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Users where id = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.put("/edit/:id", async (req, res) => {
  let id = +req.params.id;
  let user: UserPostRequest = req.body;
  let userOriginal: UserPostRequest | undefined;
  const queryAsync = util.promisify(conn.query).bind(conn);

  let sql = mysql.format("select * from Users where id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  userOriginal = rawData[0] as UserPostRequest;
  console.log(userOriginal);

  let updateUser = { ...userOriginal, ...user };
  console.log(user);
  console.log(updateUser);

  sql =
    "update  `Users` set `name`=?, `email`=?, `password`=?, `picture`=? where `id`=?";
  sql = mysql.format(sql, [
    updateUser.name,
    updateUser.email,
    updateUser.password,
    updateUser.picture,
    id,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});
