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
        .collection("orders")
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
        .collection("orders")
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
    const orders = db.db("sharing").collection("orders");

    orders.insertOne(
      {
        ...req.body,
        isReturned: false,
        usingTime: ""
      },
      (err, result) => {
        if (err) throw err;
        // 发送响应数据
        res.json({ msg: "add OK", res: result }); // 查询的结果转换成字符串返回
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.put("/", async function(req, res, next) {
  try {
    const db = await MongoClient.connect(url, { useNewUrlParser: true });
    const orders = db.db("sharing").collection("orders");
    const {openid} = req.body
    console.log(111);
    orders.updateOne(
      // query
      {
        openid
      },
      // update
      {
        $set: {
          isReturned: true,
          usingTime: req.body.usingTime
        }
      },
      (err, result) => {
        if (err) throw err;
        // 发送响应数据
        res.json({ msg: "add OK", res: JSON.stringify(result) }); // 查询的结果转换成字符串返回
      }
    );
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
