const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

router.get("/", function(req, res, next) {
  console.log(req.query)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbase = db.db("sharing");
    dbase
      .collection("boxes")
      .find(req.query)
      .toArray(function(err, result) {
        // 返回集合中所有数据
        if (err) throw err;
        // 发送响应数据
        res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
      });
  });
});

router.post("/", async function(req, res, next) {
  try {
    const db = await MongoClient.connect(url, { useNewUrlParser: true });
    const boxes = db.db("sharing").collection("boxes");
    boxes
      .insertOne({
        ...req.body
      }, (err, result) => {
        if (err) throw err;
        // 发送响应数据
        res.json({ "msg": "add OK", "res": JSON.stringify(result) }); // 查询的结果转换成字符串返回
      })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
