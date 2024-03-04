import express from "express";
import { conn } from "../connectdb";
import { UserPostRequest } from "../model/userPostRequest";
import mysql from "mysql";
import util from "util";
import { VotePostRequest } from "../model/votePostRequset";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Vote", (err, result, fields) => {
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  if (req.query.id) {
    res.send("call get in Pictures with Query Param " + req.query.id);
  } else {
    conn.query(
      "select * from Vote where id = " + req.params.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  }
  //   res.json("this is Users page")
});

router.post("/", (req, res) => {
  let vote: VotePostRequest = req.body;
  let sql =
    "INSERT INTO `Vote`(`vote_at`,`user_id`, `picture_id`) VALUES (?,?,?)";

  sql = mysql.format(sql, [vote.vote_at, vote.user_id, vote.picture_id]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Vote where id = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.put("/edit/:id", async (req, res) => {
    let id = +req.params.id;
    let vote: VotePostRequest = req.body;
    let voteOriginal: VotePostRequest | undefined;
    const queryAsync = util.promisify(conn.query).bind(conn);
  
    let sql = mysql.format("select * from Vote where id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    voteOriginal = rawData[0] as VotePostRequest;
    console.log(voteOriginal);
  
    let updateVote = { ...voteOriginal, ...vote };
    console.log(vote);
    console.log(updateVote);
  
    sql =
      "update  `Vote` set `user_id`=?, `picture_id`=? where `id`=?";
    sql = mysql.format(sql, [
        updateVote.user_id,
        updateVote.picture_id,
        id
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ affected_row: result.affectedRows });
    });
  });