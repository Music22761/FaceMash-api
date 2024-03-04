import express from "express";
import { conn } from "../connectdb";
import mysql from "mysql";
import util from "util";
import { PicturePostRequest } from "../model/picturePostRequest";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Pictures", (err, result, fields) => {
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  if (req.query.id) {
    res.send("call get in Pictures with Query Param " + req.query.id);
  } else {
    conn.query(
      "select * from Pictures where id = " + req.params.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  }
  //   res.json("this is Users page")
});

router.get("/uid/:id", (req, res) => {
  if (req.query.id) {
    res.send("call get in Pictures with Query Param " + req.query.id);
  } else {
    conn.query(
      "select * from Pictures where user_id = " + req.params.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  }
});

router.post("/", (req, res) => {
  let picture: PicturePostRequest = req.body;
  let sql = "INSERT INTO `Pictures`(`name`,`score`,`user_id`,`path`) VALUES (?,?,?,?)";

  sql = mysql.format(sql, [picture.name, picture.score, picture.user_id, picture.path]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Pictures where id = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.put("/edit/:id", async (req, res) => {
  let id = +req.params.id;
  let picture: PicturePostRequest = req.body;
  let pictureOriginal: PicturePostRequest | undefined;
  const queryAsync = util.promisify(conn.query).bind(conn);

  let sql = mysql.format("select * from Pictures where id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  pictureOriginal = rawData[0] as PicturePostRequest;
  console.log(pictureOriginal);

  let updatePicture = { ...pictureOriginal, ...picture };
  console.log(picture);
  console.log(updatePicture);

  sql = "update  `Pictures` set `name`=?,`score`=?,`user_id`=?,`path`=? where `id`=?";
  sql = mysql.format(sql, [
    updatePicture.name,
    updatePicture.score,
    updatePicture.user_id,
    updatePicture.path,
    id,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});
