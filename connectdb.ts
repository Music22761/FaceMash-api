import mysql from "mysql";

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.210",
  user: "projcs66_5",
  password: "pR0jcs99",
  database: "face_mash",
});