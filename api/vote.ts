import express from "express";
import { conn } from "../connectdb";
import { UserPostRequest } from "../model/userPostRequest";
import mysql from "mysql";
import util from "util";
import { VotePostRequest } from "../model/votePostRequset";
import { PicturePostRequest } from "../model/picturePostRequest";

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

router.get("/picture/:id", async (req, res) => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  let voteChart: VotePostRequest[] = [];

  for (let index = 0; index < 7; index++) {
    let result: any = await new Promise((resolve, reject) => {
      // ค้นหาอันดับรูปภาพทั้งหมดย้อนหลังตามจำนวนวันที่ต้องการ ด้วยวันย้อนหลังที่ i วัน
      currentDate.setDate(currentDate.getDate() - 1); // ลดวันที่ทีละ 1
      const formattedDate = currentDate.toISOString().split("T")[0];
      console.log(formattedDate);
      conn.query(
        `SELECT
        id AS vote_id,
        vote_at AS date_time,
        user_id,
        picture_id,
        score
        FROM
        Vote
        WHERE
        DATE(vote_at) = '${formattedDate}' AND 
        TIME(vote_at) = (
            SELECT MAX(TIME(vote_at))
            FROM Vote
            WHERE DATE(vote_at) = '${formattedDate}' AND picture_id = ${req.params.id}
        ) AND 
        picture_id = ${req.params.id};`,

        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    voteChart[index] = result;

    
  }
  res.status(200).json({
    voteChart:voteChart
  })
  
});

router.post("/", (req, res) => {
  let vote: VotePostRequest = req.body;
  let sql =
    "INSERT INTO `Vote`(`user_id`, `picture_id`, `score`) VALUES (?,?,?)";

  sql = mysql.format(sql, [vote.user_id, vote.picture_id, vote.score]);

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

  sql = "update  `Vote` set `user_id`=?, `picture_id`=? where `id`=?";
  sql = mysql.format(sql, [updateVote.user_id, updateVote.picture_id, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});

router.put("/edit/score/:id/", async (req, res) => {
  let id = +req.params.id;
  let vote: PicturePostRequest = req.body;
  let voteOriginal: PicturePostRequest | undefined;
  const queryAsync = util.promisify(conn.query).bind(conn);

  let sql = mysql.format("select * from Pictures where id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  voteOriginal = rawData[0] as PicturePostRequest;
  console.log(voteOriginal);

  let updateVote = { ...voteOriginal, ...vote };
  console.log(vote);
  console.log(updateVote);

  sql = "update  `Pictures` set `score`=? where `id`=?";
  sql = mysql.format(sql, [updateVote.score + voteOriginal.score, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});
