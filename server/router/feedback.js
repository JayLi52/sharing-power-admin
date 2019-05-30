const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

router.get("/", function(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbase = db.db("sharing");
    dbase
      .collection("feedback")
      .find({})
      .toArray(function(err, result) {
        // 返回集合中所有数据
        if (err) throw err;
        // 发送响应数据
        res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
      });
  });
});

router.post("/", async function(req, res, next) {
  const body = req.body;

  const db = await MongoClient.connect(url, { useNewUrlParser: true });
  const feedback = db.db("sharing").collection("feedback");

  result = await feedback.insertOne(
    {
      ...body
    },
    (err, result) => {
      if (err) throw err;
      // 发送响应数据
      res.json({ msg: "add OK", res: JSON.stringify(result) }); // 查询的结果转换成字符串返回
    }
  );
});

module.exports = router;
