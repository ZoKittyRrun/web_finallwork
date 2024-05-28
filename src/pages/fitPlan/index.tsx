import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, message, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import showAddPlanModal from './component/showAddPlanModal';
const { Option } = Select;
interface Plan {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  status: number;
  type: string;
}

interface Result {
  total: number;
  list: Plan[];
}

// 模拟的数据
const mockData: Plan[] = [
  {
    id: 1,
    name: '瘦腿10分钟',
    startTime: '2023-06-01 10:00',
    endTime: '2023-06-01 11:00',
    status: 1,
    type: '未完成',
  },
  {
    id: 2,
    name: '瘦手臂10分钟',
    startTime: '2023-06-01 10:00',
    endTime: '2023-06-01 11:00',
    status: 1,
    type: '已完成',
  },
];

//获取表格数据
const getTableData = ({ current, pageSize }, formData: Object): Promise<Result> => {
  // 模拟查询条件过滤
  let filteredData = mockData.filter((item) => {
    return Object.entries(formData).every(([key, value]) => {
      if (!value) return true;
      if (key === 'name') return item.name.includes(value);
      if (key === 'status') return item.status === value;
      return true;
    });
  });

  // 模拟分页
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  const paginatedData = filteredData.slice(start, end);

  return Promise.resolve({
    total: filteredData.length,
    list: paginatedData,
  });
};

export default () => {
  const [data, setData] = useState(mockData);
  const [form] = Form.useForm();

  //表格重绘
  const changeTable = (value: string) => {
    const newData = mockData.filter((item) => {
      if (value === '') {
        return true;
      } else {
        return item.status === value;
      }
    });
    setData(newData);
  };

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });

  const { type, changeType, submit, reset } = search;

  //按钮渲染控制
  const handleChange = async (record: Plan) => {
    await changePlanStatus(record);
  };

  //修改计划状态
  const changePlanStatus = async (record: Plan): Promise<void> => {
    const nextState = record.type === '未完成' ? 1 : 0;
    const requestData = {
      info: record.name,
      state: 1,
      type: nextState,
      startTime: new Date(record.startTime).getTime(),
      endTime: new Date(record.endTime).getTime(),
      id: record.id,
    };

    try {
      const response = await fetch('updatePlan', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      //   //mock
      //   const result = {
      //     code: 0,
      //     msg: '状态修改成功',
      //   };
      console.log(result);

      if (result.code === 0) {
        const nextType = record.type === '未完成' ? '已完成' : '未完成';
        const newData = data.map((item) =>
          item.id === record.id ? { ...item, type: nextType } : item,
        );
        setData(newData);
        message.success(`修改状态成功: ${record.name} 修改为 ${nextType}`);
        submit();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败，请稍后再试');
    }
  };

  // 新增计划按钮点击事件处理
  const handleAddPlan = async () => {
    try {
      const { name, dates } = await showAddPlanModal();
      const [startTime, endTime] = dates;

      const formattedStartTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
      const formattedEndTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');

      // 判断是否填写了计划名称
      if (!name) {
        message.error('请输入计划名称');
        return;
      }
      // 构造请求数据
      const requestData = {
        info: name,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      //   添加按钮请求
      const response = await fetch('/api/bookingPlan', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      const result = await response.json();

      //   const result = {
      //     code: 0,
      //     msg: '新增计划成功',
      //   };

      // 根据后端返回的结果进行处理
      if (result.code === 0) {
        message.success('新增计划成功');

        const newData = [
          ...data,
          {
            id: data.length + 1,
            name: name,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            status: 1,
            type: '未完成',
          },
        ];

        setData(newData);
        // 刷新表格数据
        submit();
      } else {
        message.error('新增计划失败');
      }
    } catch (error) {
      message.error('新增计划失败，请稍后再试');
    }
  };

  // 删除计划请求
  const handleDeletePlan = (record: Plan) => {
    try {
      // const response = await fetch('/api/deletePlan', {
      //   method: 'POST',
      //   body: JSON.stringify({ id: record.id }),
      // });
      // const result = await response.json();

      const requestData = {
        id: record.id,
        state: 0,
      };
      // mock
      const result = {
        code: 0,
        msg: '删除成功',
      };
      if (result.code === 0) {
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        message.success(`删除成功: ${record.name}`);
        submit();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.info(`删除l${record.name}计划`);
    }
  };

  //表单项
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '计划名称',
      dataIndex: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '状态',
      dataIndex: 'type',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Button onClick={() => handleChange(record)}>
            {record.type === '未完成' ? '标记为已完成' : '标记为未完成'}
          </Button>
          <Button onClick={() => handleDeletePlan(record)} style={{ marginLeft: 8 }}>
            删除
          </Button>
        </>
      ),
    },
  ];

  //进阶搜索
  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="计划名称" name="name">
              <Input placeholder="计划名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="status">
              <Select placeholder="选择状态">
                <Option value="">全部</Option>
                <Option value="已完成">已完成</Option>
                <Option value="未完成">未完成</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={submit}>
            搜索
          </Button>
          <Button onClick={reset} style={{ marginLeft: 16 }}>
            重置
          </Button>
          <Button type="link" onClick={changeType}>
            简单搜索
          </Button>
        </Row>
      </Form>
    </div>
  );

  //搜索
  const searchForm = (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="status" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={(value) => changeTable(value)}>
            <Option value="">全部</Option>
            <Option value="已完成">已完成</Option>
            <Option value="未完成">未完成</Option>
          </Select>
        </Form.Item>
        <Form.Item name="name">
          <Input.Search placeholder="计划名称" style={{ width: 240 }} onSearch={submit} />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          高级搜索
        </Button>
      </Form>
    </div>
  );

  return (
    <div>
      {type === 'simple' ? searchForm : advanceSearchForm}
      <Button onClick={handleAddPlan}>新增计划</Button>
      <Table
        columns={columns}
        rowKey="id"
        style={{ overflow: 'auto' }}
        dataSource={data}
        pagination={tableProps.pagination}
        onChange={tableProps.onChange}
      />
    </div>
  );
};
