const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

router.get("/", function(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbase = db.db("sharing");
    dbase
      .collection("advertise")
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
  const advertise = db.db("sharing").collection("advertise");
  advertise.insertOne(
    {
      ...body
    },
    (err, result) => {
      // 返回集合中所有数据
      if (err) throw err;
      // 发送响应数据
      res.send({ msg: "add OK", res: result }); // 查询的结果转换成字符串返回
    }
  );
});

module.exports = router;
