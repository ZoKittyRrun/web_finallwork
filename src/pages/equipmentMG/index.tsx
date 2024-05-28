import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, message, Row, Select, Table } from 'antd';
import { useState } from 'react';

const { Option } = Select;

interface Course {
  id: number;
  name: string;
  teacher: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Result {
  total: number;
  list: Course[];
}

// 模拟的数据
const mockData: Course[] = [
  {
    id: 1,
    name: '瘦腿',
    teacher: '李教练',
    startTime: '2023-06-01 10:00',
    endTime: '2023-06-01 11:00',
    status: '正常',
  },
  {
    id: 2,
    name: '瘦腰',
    teacher: '王教练',
    startTime: '2023-06-01 12:00',
    endTime: '2023-06-01 13:00',
    status: '维修中',
  },
  {
    id: 3,
    name: '瘦头',
    teacher: '张教练',
    startTime: '2023-06-02 14:00',
    endTime: '2023-06-02 15:00',
    status: '已下线',
  },
];

// 获取表格数据
const getTableData = ({ current, pageSize }, formData: Object): Promise<Result> => {
  // 模拟查询条件过滤
  let filteredData = mockData.filter((item) => {
    return Object.entries(formData).every(([key, value]) => {
      if (!value) return true;
      if (key === 'name') return item.name.includes(value);
      if (key === 'teacher') return item.teacher.includes(value);
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

  // 表格重绘
  const changeTable = (value: string) => {
    const newData = mockData.filter((item) => {
      if (value === '') {
        return true; // 如果筛选条件为空，则返回所有数据
      } else {
        return item.status === value; // 否则只返回符合筛选条件的数据
      }
    });
    setData(newData);
  };

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });

  const { type, changeType, submit, reset } = search;

  // 按钮控制
  const handleChange = async (record: Course) => {
    if (record.status === '正常' || record.status === '预约中') {
      await changeEquiStatus(record, record.status === '预约中' ? 1 : 0);
    } else {
      message.warning(`当前状态为 ${record.status}，无法进行预约操作`);
    }
  };

  // 更改器材状态
  const changeEquiStatus = async (record: Course, state: number): Promise<void> => {
    const requestData = {
      id: record.id,
      startTime: new Date(record.startTime).getTime(),
      endTime: new Date(record.endTime).getTime(),
      state,
    };

    try {
      // const response = await fetch('/api/changeCoursestatus', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // const result = await response.json();

      //mock
      const result = {
        code: 0,
        msg: '状态修改成功',
      };

      if (result.code === 0) {
        const nextStatus = record.status === '正常' ? '预约中' : '正常';
        const newData = data.map((item) =>
          item.id === record.id ? { ...item, status: nextStatus } : item,
        );
        setData(newData);
        submit();
        message.success(`${state === 1 ? '预约成功' : '取消预约成功'}: ${record.name}`);
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败，请稍后再试');
    }
  };

  // 表单项
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '课程名称',
      dataIndex: 'name',
    },
    {
      title: '教练',
      dataIndex: 'teacher',
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
      dataIndex: 'status',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Button
          onClick={() => handleChange(record)}
          disabled={record.status === '维修中' || record.status === '已下线'}
        >
          {record.status === '正常' ? '预约' : record.status === '预约中' ? '取消预约' : '不可操作'}
        </Button>
      ),
    },
  ];

  // 进阶表单
  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="课程名称" name="name">
              <Input placeholder="课程名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="教练" name="teacher">
              <Input placeholder="教练" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="status">
              <Select placeholder="选择状态">
                <Option value="">全部</Option>
                <Option value="正常">正常</Option>
                <Option value="预约中">预约中</Option>
                <Option value="维修中">维修中</Option>
                <Option value="已下线">已下线</Option>
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

  // 搜索表单
  const searchForm = (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="status" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={(value) => changeTable(value)}>
            <Option value="">全部</Option>
            <Option value="正常">正常</Option>
            <Option value="预约中">预约中</Option>
            <Option value="维修中">维修中</Option>
            <Option value="已下线">已下线</Option>
          </Select>
        </Form.Item>
        <Form.Item name="name">
          <Input.Search placeholder="课程名称" style={{ width: 240 }} onSearch={submit} />
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
