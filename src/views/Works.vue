<template>
  <div>
    <a-card>
      <div slot="title">
        <!-- <a-input-search placeholder="机柜名" v-model="search" style="width:400px"/> -->
        <a-button type="primary" @click="add" class="pull-right">添加工单</a-button>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record._id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <a slot="operation" slot-scope="text" @click="() => update(text)">更新工单状态</a>
        <template slot="status" slot-scope="text, record">
          <a-tag color="#87d068" v-if="record.status==1">已完成</a-tag>
          <a-tag color="#f50" v-if="record.status==0">未完成</a-tag>
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
        <a-form-item label="反馈信息 ID" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'feedbackId',
          {rules: [{ required: true, message: 'Please input 反馈信息 Id!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="工单执行人" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'executor',
          {rules: [{ required: true, message: 'Please input 工单执行人!' }]}
        ]"
          />
        </a-form-item>
      </a-form>
      <p>
        反馈信息 ID请参照
       反馈信息管理 进行填写，一条反馈信息关联一条订单
      </p>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
const columns = [
  // 订单列表和充电宝列表是数组，如果展现需要展现详细信息，这样设计不合适
  {
    title: "工单 ID",
    dataIndex: "id"
  },
  {
    title: "反馈信息 ID",
    dataIndex: "feedbackId"
  },
  {
    title: " 工单提交时间",
    dataIndex: "commitTime"
  },
  {
    title: "工单结束时间",
    dataIndex: "finishTime"
  },
  {
    title: " 工单状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "工单执行人",
    dataIndex: "executor"
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "operation" }
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
      form: this.$form.createForm(this),
      mode: 'create'
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
        url: "http://localhost:3100/v1/work",
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
    edit(data) {
      this.visible = true;
      this.mode = 'edit'
      this.form.setFieldsValue({
        ...data
      })
    },
    save(data) {
      axios
        .post("http://localhost:3100/v1/work", {
          ...data
        })
        .then(res => {
          this.fetch()
        });
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        let data = {
          id: values.id,
          feedbackId: values.feedbackId,
          commitTime: new Date().toString(),
          finishTime: "",
          executor: values.executor,
          status: 0
        };
        console.log(data);
        if (!err) {
          this.save(data);
          this.visible = false
        }
      });
    },
    update(data) {
      // 更新工单状态
      axios.put('http://localhost:3100/v1/work', {
        
      })
    }
  }
};
</script>
