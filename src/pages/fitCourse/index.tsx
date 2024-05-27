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
    status: '空闲',
  },
  {
    id: 2,
    name: '瘦腰',
    teacher: '王教练',
    startTime: '2023-06-01 12:00',
    endTime: '2023-06-01 13:00',
    status: '空闲',
  },
  {
    id: 3,
    name: '瘦头',
    teacher: '张教练',
    startTime: '2023-06-02 14:00',
    endTime: '2023-06-02 15:00',
    status: '预约中',
  },
  // 可以添加更多模拟数据
];

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

const reserveCourse = async (record: Course): Promise<void> => {
  try {
    // 模拟后端请求
    // const response = await fetch('/api/reserve', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     id: record.id,
    //   }),
    // });

    // const result = await response.json();
    const result = {
      code: 0,
      msg: '预约成功',
    };
    console.log(result);

    if (result.code === 0) {
      message.success(`预约成功: ${record.name}`);
    } else {
      message.error('预约失败');
    }
  } catch (error) {
    message.error('预约失败，请稍后再试');
  }
};

export default () => {
  const [data, setData] = useState(mockData);
  const [form] = Form.useForm();

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });
  console.log('tableProps');

  const { type, changeType, submit, reset } = search;

  const handleChange = (record: Course, value: string) => {
    // 更新前端数据
    const newData = data.map((item) => (item.id === record.id ? { ...item, status: value } : item));
    setData(newData);
    message.success(`修改状态成功: ${record.name} 修改为 ${value}`);
    submit();
  };
  const handleReserve = async (record: Course) => {
    await reserveCourse(record);

    // 更新前端数据
    const newData = data.map((item) =>
      item.id === record.id ? { ...item, status: '预约中' } : item,
    );
    setData(newData);
    submit();
  };
  //更新前端数据
  const changeTable = (value: string) => {
    // 根据筛选条件的变化重新获取数据
    const newData = mockData.filter((item) => {
      if (value === '') {
        return true; // 如果筛选条件为空，则返回所有数据
      } else {
        return item.status === value; // 否则只返回符合筛选条件的数据
      }
    });
    // 更新状态以重新渲染表格
    setData(newData);
  };

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
        <>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleChange(record, value)}
          >
            <Option value="空闲">空闲</Option>
            <Option value="预约中">预约中</Option>
          </Select>
        </>
      ),
    },
  ];

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
                <Option value="空闲">空闲</Option>
                <Option value="预约中">预约中</Option>
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

  const searchForm = (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="status" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={(value) => changeTable(value)}>
            <Option value="">全部</Option>
            <Option value="空闲">空闲</Option>
            <Option value="预约中">预约中</Option>
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
