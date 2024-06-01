import { bookingPlan, getPlan, updatePlan } from '@/services/data';
import { useAntdTable } from 'ahooks';
import { Button, Col, Form, Input, message, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import showAddPlanModal from './component/showAddPlanModal';

const { Option } = Select;

interface Plan {
  id: number;
  info: string;
  startTime: number | string;
  endTime: number | string;
  status: number;
  type: string;
}

interface Result {
  total: number;
  list: Plan[];
}

export default () => {
  const [data, setData] = useState<Plan[]>([]);
  const [filteredData, setFilteredData] = useState<Plan[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlan({});
      const mockData = response.data;

      //格式化日期
      const formatted = mockData.map((item: any) => ({
        ...item,
        startTime: dayjs.unix(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs.unix(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
      }));
      setData(formatted);
      setFilteredData(formatted);
    };

    fetchData();
  }, []);

  //获取表格数据
  const getTableData = ({ current, pageSize }, formData: Object): Promise<Result> => {
    // 模拟查询条件过滤
    let filteredData = data.filter((item: Plan) => {
      return Object.entries(formData).every(([key, value]) => {
        if (!value) return true;
        if (key === 'info') return item.info.includes(value);
        if (key === 'type') return item.type === value;
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

  //表格重绘
  const changeTable = (value: string) => {
    const newData = data.filter((item: Plan) => {
      if (value === '') {
        return true;
      } else {
        return item.type === value;
      }
    });

    setFilteredData(newData);
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
    const newType = record.type === '未完成' ? '已完成' : '未完成';
    const requestData = {
      info: record.info,
      state: 1,
      type: newType,
      startTime: dayjs(record.startTime).unix(),
      endTime: dayjs(record.endTime).unix(),
      id: record.id,
    };
    const response = await updatePlan(requestData);
    if (response.code === 0) {
      const newData = data.map((item: Plan) =>
        item.id === record.id ? { ...item, type: newType } : item,
      );
      setData(newData);
      setFilteredData(newData);
      message.success(`修改状态成功: ${record.info} 修改为 ${newType}`);
      submit();
    }
  };

  // 新增计划按钮点击事件处理
  const handleAddPlan = async () => {
    const { name, dates } = await showAddPlanModal();
    const [startTime, endTime] = dates;

    const formattedStartTime = dayjs(startTime).unix();
    const formattedEndTime = dayjs(endTime).unix();

    // 判断是否填写了计划名称
    if (!name) {
      message.error('请输入计划名称');
      return;
    }
    const requestData = {
      info: name,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    const response = await bookingPlan(requestData);

    if (response.code === 0) {
      const newData = [
        ...data,
        {
          id: data.length + 1,
          info: name,
          startTime: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
          status: 1,
          type: '未完成',
        },
      ];
      setData(newData);
      submit();
    }
  };

  // 删除计划请求
  const handleDeletePlan = async (record: Plan) => {
    const formattedStartTime = dayjs(record.startTime).unix();
    const formattedEndTime = dayjs(record.endTime).unix();
    const requestData = {
      info: record.info,
      state: 0,
      type: record.type,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      id: record.id,
    };
    const response = await updatePlan(requestData);

    if (response.code === 0) {
      const newData = data.filter((item: Plan) => item.id !== record.id);
      setData(newData);
      message.success(`删除成功: ${record.info}`);
      submit();
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
      dataIndex: 'info',
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
            <Form.Item label="计划名称" name="info">
              <Input placeholder="计划名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="type">
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
        <Form.Item name="type" initialValue="">
          <Select style={{ width: 120, marginRight: 16 }} onChange={(value) => changeTable(value)}>
            <Option value="">全部</Option>
            <Option value="已完成">已完成</Option>
            <Option value="未完成">未完成</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item name="info">
          <Input.Search placeholder="计划名称" style={{ width: 240 }} onSearch={submit} />
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
      <Button onClick={handleAddPlan}>新增计划</Button>
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
