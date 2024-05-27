import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, message, Row, Select, Table } from 'antd';
import { useState } from 'react';
const { Option } = Select;

interface Equipment {
  id: number;
  name: string;
  type: string;
  status: string;
  createTime: string | null;
}

interface Result {
  total: number;
  list: Equipment[];
}

// 模拟的数据
const mockData: Equipment[] = [
  { id: 1, name: '跑步机1111', type: '跑步机', status: '正常', createTime: '2023-05-27' },
  { id: 2, name: '椭圆机2222', type: '椭圆机', status: '维护中', createTime: '2023-05-28' },
  { id: 3, name: '蝴蝶机3333', type: '蝴蝶机', status: '预约中', createTime: '2023-05-28' },
  // 可以添加更多模拟数据
];

const getTableData = ({ current, pageSize }, formData: Object): Promise<Result> => {
  // 模拟查询条件过滤
  let filteredData = mockData.filter((item) => {
    return Object.entries(formData).every(([key, value]) => {
      if (!value) return true;
      if (key === 'name') return item.name.includes(value);
      if (key === 'type') return item.type.includes(value);
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

const reserveEquipment = async (record: Equipment): Promise<void> => {
  try {
    // 这里模拟后端请求
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
      startTime: 0,
      endTime: 0,
      state: 0,
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

  const { type, changeType, submit, reset } = search;
  const handleChange = (record: Equipment, value: any) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === record.id ? { ...item, status: value } : item)),
    );
    submit();
    message.success(`修改状态成功: ${record.name}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      render: (text) => text || 'N/A',
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
            <Option value="维护中">维护中</Option>
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
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Type" name="type">
              <Input placeholder="Type" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select Status">
                <Option value="">All</Option>
                <Option value="正常">正常</Option>
                <Option value="维护中">维护中</Option>
                <Option value="预约中">预约中</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={submit}>
            Search
          </Button>
          <Button onClick={reset} style={{ marginLeft: 16 }}>
            Reset
          </Button>
          <Button type="link" onClick={changeType}>
            Simple Search
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
            <Option value="">All</Option>
            <Option value="正常">正常</Option>
            <Option value="维护中">维护中</Option>
            <Option value="预约中">预约中</Option>
          </Select>
        </Form.Item>
        <Form.Item name="name">
          <Input.Search placeholder="Enter Name" style={{ width: 240 }} onSearch={submit} />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          Advanced Search
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
        {...tableProps}
        dataSource={data}
      />
    </div>
  );
};
