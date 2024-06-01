import { bookingMachine, getMachineList } from '@/services/data';
import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, message, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import bookTime from './component/bookTime';

const { Option } = Select;

interface Course {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  status: string;
  has_booking: string;
}

interface Result {
  total: number;
  list: Course[];
}

const fetchMachineData = async (): Promise<Course[]> => {
  const response = await getMachineList({});
  return response.data.map((item: any) => ({
    ...item,
    startTime: 'startTime' in item ? dayjs.unix(item.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: 'endTime' in item ? dayjs.unix(item.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
    has_booking: item.has_booking === 1 ? '预约中' : '空闲',
  }));
};

export default () => {
  const [data, setData] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const formattedData = await fetchMachineData();
      setData(formattedData);
      setFilteredData(formattedData);
    };

    fetchData();
  }, []);

  const getTableData = ({ current, pageSize }, formData: Object): Promise<Result> => {
    let filteredData = data.filter((item) => {
      return Object.entries(formData).every(([key, value]) => {
        if (!value) return true;
        if (key === 'name') return item.name.includes(value);
        if (key === 'has_booking') return item.has_booking === value;
        return true;
      });
    });

    const start = (current - 1) * pageSize;
    const end = current * pageSize;
    const paginatedData = filteredData.slice(start, end);

    return Promise.resolve({
      total: filteredData.length,
      list: paginatedData,
    });
  };

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });

  const { type, changeType, submit, reset } = search;

  const handleChange = async (record: Course) => {
    if (record.has_booking === '空闲' || record.has_booking === '预约中') {
      await changeEquiStatus(record, record.has_booking === '空闲' ? 1 : 0);
    } else {
      message.warning(`当前状态为 ${record.status}，无法进行预约操作`);
    }
  };

  const changeEquiStatus = async (record: Course, isBook: number): Promise<void> => {
    let startTime = 0,
      endTime = 0,
      startBookTime = '',
      endBookTime = '';
    let requestData: any = {
      id: record.id,
      state: isBook,
    };

    if (isBook === 1) {
      const dates = await bookTime();
      [startTime, endTime] = dates;
      requestData.startTime = dayjs(startTime).unix();
      requestData.endTime = dayjs(endTime).unix();
      startBookTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
      endBookTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
    }

    const response = await bookingMachine(requestData);

    if (response.code === 0) {
      const nextStatus = isBook === 1 ? '预约中' : '空闲';
      const newData = data.map((item) =>
        item.id === record.id
          ? {
              ...item,
              startTime: startBookTime,
              endTime: endBookTime,
              has_booking: nextStatus,
            }
          : item,
      );
      setData(newData);
      setFilteredData(newData);
      submit();
    }
  };

  const changeTable = (value: string) => {
    const newData = data.filter((item) => {
      if (value === '') {
        return true;
      } else {
        return item.has_booking === value;
      }
    });
    setFilteredData(newData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '器材名称',
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
      dataIndex: 'has_booking',
    },
    {
      title: '操作',
      render: (text, record: Course) => (
        <Button
          onClick={() => handleChange(record)}
          disabled={record.status === '维修中' || record.status === '已下线'}
        >
          {record.has_booking === '空闲' ? '预约' : '取消预约'}
        </Button>
      ),
    },
  ];

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="器材名称" name="name">
              <Input placeholder="器材名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="has_booking">
              <Select placeholder="选择状态" onChange={changeTable}>
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
        <Form.Item name="has_booking" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={changeTable}>
            <Option value="">全部</Option>
            <Option value="空闲">空闲</Option>
            <Option value="预约中">预约中</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item name="name">
          <Input.Search placeholder="器材名称" style={{ width: 240 }} onSearch={submit} />
        </Form.Item> */}
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
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
        dataSource={filteredData}
        pagination={tableProps.pagination}
        onChange={tableProps.onChange}
      />
    </div>
  );
};
