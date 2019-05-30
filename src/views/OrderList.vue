<template>
  <a-table
    :columns="columns"
    :rowKey="record => record._id"
    :dataSource="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template slot="isReturned" slot-scope="text, record">
      <a-tag color="#87d068" v-if="record.isReturned==true">已完成</a-tag>
      <a-tag color="#f50" v-if="record.isReturned==false">未完成</a-tag>
    </template>
    <template slot="operation" slot-scope="text, record">
      <a-button @click="() => updateStatus(text, record)">更新状态</a-button>
    </template>
  </a-table>
</template>
<script>
import axios from "axios";
const columns = [
  {
    title: "订单 ID",
    dataIndex: "_id"
  },
  {
    title: "充电宝ID",
    dataIndex: "chargerid"
  },
  {
    title: "充电柜位置",
    dataIndex: "address"
  },
  {
    title: "下单时间",
    dataIndex: "borrowTime"
  },
  {
    title: "订单状态",
    dataIndex: "isReturned",
    scopedSlots: { customRender: "isReturned" }
  },
  {
    title: "使用时长",
    dataIndex: "usingTime"
  },
  {
    title: "确认归还",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  mounted() {
    this.fetch();
  },
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns
    };
  },
  methods: {
    updateStatus(text, record) {
      const {actoken, formid, openid} = record
      console.log(actoken, formid, openid)
      !record.isReturned &&
        axios({
          url: "http://localhost:3100/v1/order",
          method: "PUT",
          data: {
            ...record,
            isReturned: true,
            usingTime:
              parseInt(
                (new Date().getTime() - new Date(record.borrowTime).getTime()) /
                  60000,
                10
              ) + " Minutes"
          }
        })
          .then(res => {
            console.log(res);
            this.fetch()
            // 归还成功后发送模板消息给微信用户
            this.sendMessage(actoken, formid, openid)
          })
          .catch(err => {
            console.log(err);
          });
    },
    sendMessage(actoken, formid, openid) {
      axios({
        url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${actoken}`,
        method: "POST",
        data: {
          touser: openid,
          weapp_template_msg: {
            template_id: "4KKjb-m4hCXTGVQGQJkkEfA-ZkgDLIyOIAVcsBkQs3w",
            page: "pages/personal/orderList",
            form_id: formid,
            data: {
              keyword1: {
                value: "339208499"
              },
              keyword2: {
                value: "2019年06月05日 12:30"
              },
              keyword3: {
                value: "东北林业大学丹青楼"
              },
              keyword4: {
                value: "校园充电服务"
              }
            },
            emphasis_keyword: "keyword1.DATA"
          },
          mp_template_msg: {
            appid: "APPID ",
            template_id: "TEMPLATE_ID",
            url: "http://weixin.qq.com/download",
            miniprogram: {
              appid: "xiaochengxuappid12345",
              pagepath: "index?foo=bar"
            },
            data: {
              first: {
                value: "恭喜你购买成功！",
                color: "#173177"
              },
              keyword1: {
                value: "巧克力",
                color: "#173177"
              },
              keyword2: {
                value: "39.8元",
                color: "#173177"
              },
              keyword3: {
                value: "2014年9月22日",
                color: "#173177"
              },
              remark: {
                value: "欢迎再次购买！",
                color: "#173177"
              }
            }
          }
        }
      })
        .then(res => {
          console.log(res);

        })
        .catch(err => {
          console.log(err);
        });
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch();
    },
    fetch() {
      this.loading = true;
      axios({
        url: "http://localhost:3100/v1/order",
        method: "get",
        type: "json"
      }).then(res => {
        this.data = res.data;
        this.loading = false;
      });
    }
  }
};
</script>
