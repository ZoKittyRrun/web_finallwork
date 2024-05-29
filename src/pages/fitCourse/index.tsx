import { bookingCourse, getAllCourse } from '@/services/data';
import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Course {
  id: number;
  courseName: string;
  teacher: string;
  startTime: string;
  endTime: string;
  has_booking: string | number;
}

interface Result {
  total: number;
  list: Course[];
}

const fetchAllCourses = async (): Promise<Course[]> => {
  const response = await getAllCourse({});
  return response.data.map((item: any) => ({
    ...item,
    startTime: dayjs.unix(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs.unix(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
    has_booking: item.has_booking === 1 ? '预约中' : '空闲',
  }));
};

export default () => {
  const [data, setData] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const courses = await fetchAllCourses();
      setData(courses);
      setFilteredData(courses);
    };

    fetchData();
  }, []);

  const getTableData = async ({ current, pageSize }, formData: Object): Promise<Result> => {
    // 模拟查询条件过滤
    let filteredData = data.filter((item) => {
      return Object.entries(formData).every(([key, value]) => {
        if (!value) return true;
        if (key === 'courseName') return item.courseName.includes(value);
        if (key === 'teacher') return item.teacher.includes(value);
        if (key === 'has_booking') return item.has_booking === value;
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

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });

  const { type, changeType, submit, reset } = search;

  const handleChange = async (record: Course) => {
    const nextStatus = record.has_booking === '预约中' ? 0 : 1;
    await changeCourseStatus(record, nextStatus);
  };

  const changeCourseStatus = async (record: Course, nextStatus: number): Promise<void> => {
    const requestData = {
      id: record.id,
      state: nextStatus,
    };

    const response = await bookingCourse(requestData);

    if (response.code === 0) {
      const newData = data.map((item: Course) =>
        item.id === record.id
          ? { ...item, has_booking: nextStatus === 1 ? '预约中' : '空闲' }
          : item,
      );
      setData(newData);
      setFilteredData(newData);
      submit();
    }
  };

  const changeTable = (value: string) => {
    const newData = data.filter((item: Course) => {
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
      title: '课程名称',
      dataIndex: 'courseName',
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
      dataIndex: 'has_booking',
    },
    {
      title: '操作',
      render: (text, record: Course) => (
        <Button onClick={() => handleChange(record)}>
          {record.has_booking === '预约中' ? '取消预约' : '预约'}
        </Button>
      ),
    },
  ];

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="课程名称" name="courseName">
              <Input placeholder="课程名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="教练" name="teacher">
              <Input placeholder="教练" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="has_booking">
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
        <Form.Item name="has_booking" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={(value) => changeTable(value)}>
            <Option value="">全部</Option>
            <Option value="空闲">空闲</Option>
            <Option value="预约中">预约中</Option>
          </Select>
        </Form.Item>
        <Form.Item name="courseName">
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
        dataSource={filteredData}
        pagination={tableProps.pagination}
        onChange={tableProps.onChange}
      />
    </div>
  );
};
