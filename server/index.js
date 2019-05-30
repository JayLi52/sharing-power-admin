const path = require('path')
const fs = require('fs')
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 路由处理文件
const order = require('./router/order')
const box = require('./router/box')
const charger = require('./router/charger')
const feedback = require('./router/feedback')
const advertise = require('./router/advertise')
const work = require('./router/work')

app.use('/v1/order', order)
app.use('/v1/box', box)
app.use('/v1/charger', charger)
app.use('/v1/feedback', feedback)
app.use('/v1/advertise', advertise)
app.use('/v1/work', work)

// 管理系统路由处理
const filesPath = {
  stores: path.resolve(__dirname, './data/stores.json'),
  boxes: path.resolve(__dirname, './data/boxes.json'),
  order_list: path.resolve(__dirname, './data/order_list.json'),
  chargers: path.resolve(__dirname, './data/chargers.json')
}

app.get('/v1/stores', function(req, res) {
  let data = fs.readFileSync(filesPath.stores)
  res.json({
    data: JSON.parse(data.toString())
  })
})
app.get('/v1/boxes', function(req, res) {
  let data = fs.readFileSync(filesPath.boxes)
  res.json({
    data: JSON.parse(data.toString())
  })
})
app.get('/v1/orders', function(req, res) {
  let data = fs.readFileSync(filesPath.order_list)
  res.json({
    data: JSON.parse(data.toString())
  })
})
app.get('/v1/chargers', function(req, res) {
  let data = fs.readFileSync(filesPath.chargers)
  res.json({
    data: JSON.parse(data.toString())
  })
})
app.put('/v1/stores/:id', function(req, res) {
  let data = JSON.parse(fs.readFileSync(filesPath.stores))
  console.log(req.params.id, req.body)
  res.json({
    data: { msg: 'ok' }
  })
})
app.listen(3100)
