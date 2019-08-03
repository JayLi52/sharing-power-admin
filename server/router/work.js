const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

router.get("/", function(req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const openid = req.query.openid;
    const dbase = db.db("sharing");
    if (openid) {
      dbase
        .collection("works")
        .find({
          openid
        })
        .toArray(function(err, result) {
          // 返回集合中所有数据
          if (err) throw err;
          // 发送响应数据
          res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
        });
    } else {
      dbase
        .collection("works")
        .find({})
        .toArray(function(err, result) {
          // 返回集合中所有数据
          if (err) throw err;
          // 发送响应数据
          res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
        });
    }
  });
});

router.post("/", async function(req, res, next) {
  try {
    const db = await MongoClient.connect(url, { useNewUrlParser: true });
    const works = db.db("sharing").collection("works");

    const result = await works.insertOne({
      ...req.body
    });
    res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
  } catch (error) {
    console.log(error);
  }
});

router.put("/", async function(req, res, next) {
  try {
    const db = await MongoClient.connect(url, { useNewUrlParser: true });
    const works = db.db("sharing").collection("works");
    const {id, status, finishTime, usingTime} = req.body
    const result = await works.updateOne(
      // query
      {
        id,
        status
      },

      // update
      {
        $set: {
          status: 1,
          finishTime,
          usingTime
        }
      }
    );

    res.send(JSON.stringify(result)); // 查询的结果转换成字符串返回
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
