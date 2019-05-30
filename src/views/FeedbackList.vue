<template>
  <div>
    <a-card>
      <div slot="title">
        <!-- <a-input-search placeholder="机柜名" v-model="search" style="width:400px"/> -->
        <!-- <a-button type="primary" @click="add" class="pull-right">添加充电宝</a-button> -->
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record._id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      ></a-table>
    </a-card>
    <a-modal title="添加充电宝" v-model="visible" @ok="handleSubmit">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item label="ID" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'id',
          {rules: [{ required: true, message: 'Please input ID!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="boxId" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'boxId',
          {rules: [{ required: true, message: 'Please input 所属机柜 ID!' }]}
        ]"
          />
        </a-form-item>
      </a-form>
      <p>
        机柜 ID请参照
        <a href="/Index/BoxList">机柜管理页</a>填写
      </p>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
const columns = [
  {
    title: "用户 OpenID",
    dataIndex: "openId"
  },
  {
    title: "提交时间",
    dataIndex: "commitTime"
  },
  {
    title: "反馈信息类型",
    dataIndex: "type"
  },
  {
    title: "反馈内容",
    dataIndex: "content"
  },
  {
    title: "订单 ID",
    dataIndex: "orderId"
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
      columns,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      row: {},
      form: this.$form.createForm(this)
    };
  },
  methods: {
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
        url: "http://localhost:3100/v1/feedback",
        method: "get",
        type: "json"
      }).then(res => {
        this.data = res.data;
        this.loading = false;
      });
    },
    add() {
      this.visible = true;
    },
    save(data) {
      axios
        .post("http://localhost:3100/v1/feedback", {
          ...data
        })
        .then(res => {
          console.log(res);
        });
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        let data = {
          id: values.id,
          boxId: values.boxId,
          createdAt: new Date().toString(),
          times: 0,
          power: 100
        };
        console.log(data);
        if (!err) {
          this.save(data);
        }
      });
    }
  }
};
</script>
