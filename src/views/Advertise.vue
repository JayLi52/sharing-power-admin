<template>
  <div>
    <a-card>
      <div slot="title">
        <!-- <a-input-search placeholder="机柜名" v-model="search" style="width:400px"/> -->
        <a-button type="primary" @click="add" class="pull-right">添加广告</a-button>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record._id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="material" slot-scope="text, record">
          <img :src="record.material" alt width="100">
        </template>
      </a-table>
    </a-card>
    <a-modal title="添加广告" v-model="visible" @ok="handleSubmit">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item label="ID" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'id',
          {rules: [{ required: true, message: 'Please input ID!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="广告素材" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'material',
          {rules: [{ required: true, message: 'Please input 广告素材 URL' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="排期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'schedule',
          {rules: [{ required: true, message: 'Please input 广告排期' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="广告主" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="[
          'advertiser',
          {rules: [{ required: true, message: 'Please input 广告主信息' }]}
        ]"
          />
        </a-form-item>
      </a-form>
      <p>广告排期格式：2019.05.20-2019.06.19</p>
      <p>广告主信息格式：李某 phone number</p>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
import * as R from "ramda";
const columns = [
  {
    title: "广告 ID",
    dataIndex: "id"
  },
  {
    title: "广告素材",
    dataIndex: "material",
    scopedSlots: { customRender: "material" }
  },
  {
    title: "排期",
    dataIndex: "schedule"
  },
  {
    title: "广告主",
    dataIndex: "advertiser"
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
        url: "http://localhost:3100/v1/advertise",
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
      const { id, material } = data;
      // 检查原有数组中是否存在新增数据
      const isExist = this.data.some(item => {
        const pred = R.whereEq({ id });
        return pred(item);
      });

      console.log("isExist", isExist);
      if (isExist) {
        this.$message.warning("重复添加数据");
        return;
      }

      const img = new Image();
      img.onload = () => {
        console.log(img.width, img.height);
        if (img.width === 300 && img.height === 300) {
          this.$message.success("图片符合规格");
          axios
            .post("http://localhost:3100/v1/advertise", {
              ...data
            })
            .then(res => {
              console.log(res);
              this.$message.success("添加数据成功");
              this.fetch()
              this.visible = false;
            });
        } else {
          this.$message.warning("图片不符合规格");
        }
      };
      img.src = material;
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        let data = {
          ...values
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
