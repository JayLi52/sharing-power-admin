<template>
  <div>
    <a-card>
      <div slot="title">
        <!-- <a-input-search placeholder="机柜名" v-model="search" style="width:400px"/> -->
        <a-button type="primary" @click="add" class="pull-right">添加充电宝</a-button>
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
        <a-form-item label="机柜 ID" :label-col="labelCol" :wrapper-col="wrapperCol">
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
import * as R from "ramda"
const columns = [
  {
    title: "充电宝 ID",
    dataIndex: "id"
  },
  {
    title: "机柜 ID",
    dataIndex: "boxId"
  },
  {
    title: "入驻时间",
    dataIndex: "createdAt"
  },
  {
    title: "使用次数",
    dataIndex: "times"
  },
  {
    title: "剩余电量",
    dataIndex: "power"
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
        url: "http://localhost:3100/v1/charger",
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
      const { id } = data;
      // 检查原有数组中是否存在新增数据
      const isExist = this.data.some(item => {
        const pred = R.whereEq({ id });
        return pred(item);
      });

      console.log("isExist", isExist);
      if (isExist) {
        this.$message.warning('重复添加数据');
        return;
      }
      axios
        .post("http://localhost:3100/v1/charger", {
          ...data,
          orders: []
        })
        .then(res => {
          this.$message.success('添加数据成功');
          this.visible = false
          this.fetch()
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
