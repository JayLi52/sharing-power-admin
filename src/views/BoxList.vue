<template>
  <div>
    <a-card>
      <div slot="title">
        <!-- <a-input-search placeholder="机柜名" v-model="search" style="width:400px"/> -->
        <a-button type="primary" @click="add" class="pull-right">添加机柜</a-button>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record._id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="address" slot-scope="text, record">
          <a-popover title="经纬度">
            <template slot="content">
              <p>经度：{{record.location.longitude}}</p>
              <p>纬度：{{record.location.latitude}}</p>
            </template>
            <p>{{text}}</p>
          </a-popover>
        </template>
      </a-table>
    </a-card>
    <a-modal title="添加机柜" v-model="visible" @ok="handleSubmit">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item label="ID" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'id',
          {rules: [{ required: true, message: 'Please input ID!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="地址" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'address',
          {rules: [{ required: true, message: 'Please input address!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="经度" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            type="number"
            :min="0"
            :max="360"
            :step="0.0001"
            v-decorator="[
          'longitude',
          {rules: [{ required: true, message: 'Please input longitude!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="纬度" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            type="number"
            :min="-90"
            :max="90"
            :step="0.0001"
            v-decorator="[
          'latitude',
          {rules: [{ required: true, message: 'Please input latitude!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="充电宝总数" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            type="number"
            v-decorator="[
          'count',
          {rules: [{ required: true, message: 'Please input count!' }]}
        ]"
          />
        </a-form-item>
      </a-form>
      <p>
        经纬度请参照
        <a href="http://www.gpsspg.com/maps.htm">腾讯地图经纬度</a>进行精确描述，精确至四位小数
      </p>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
import * as R from "ramda";
const columns = [
  // 订单列表和充电宝列表是数组，如果展现需要展现详细信息，这样设计不合适
  {
    title: "机柜 ID",
    dataIndex: "id"
  },
  {
    title: "充电宝总数",
    dataIndex: "count"
  },
  {
    title: "充电柜位置",
    dataIndex: "address",
    scopedSlots: { customRender: "address" }
  },
  {
    title: "剩余数量",
    dataIndex: "remainingNum"
  },
  {
    title: "入驻时间",
    dataIndex: "createdAt"
  }
];

export default {
  mounted() {
    this.fetch();
    window.vm = this;
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
        url: "http://localhost:3100/v1/box",
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
      const { location, id } = data;
      // 检查原有数组中是否存在新增数据
      const isExist = this.data.some(item => {
        const pred = R.whereEq({ location, id });
        return pred(item);
      });

      console.log("isExist", isExist);
      if (isExist) {
        this.$message.warning('重复添加数据');
        return;
      }

      axios
        .post("http://localhost:3100/v1/box", {
          ...data
        })
        .then(res => {
          this.fetch();
          this.visible = false;
          this.$message.success('添加数据成功');
        });
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        let data = {
          id: values.id,
          location: {
            longitude: values.longitude,
            latitude: values.latitude
          },
          count: values.count,
          createdAt: new Date().toString(),
          chargers: [],
          address: values.address,
          records: [],
          remainingNum: values.count
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
