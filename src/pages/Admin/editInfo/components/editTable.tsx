import React, {FC, useEffect, useState} from 'react';
import {changeOneWork, getStudentInfoById} from "@/services/data";
import {useRequest} from "umi";
import {Form, Input, InputNumber, message, Popconfirm, Spin, Table, Typography} from "antd";
import type { ProColumns } from '@ant-design/pro-components';


interface Item {
  id: number;
  time: number;
  score: number;
}

const editTable:FC<{
  userId:number
}>=({userId})=>{
  const {data,loading}=useRequest(()=>{
    return getStudentInfoById(userId)
  })
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [datas, setData] = useState();
  const [changLoading,setChangeLoading]=useState(false)
  const isEditing = (record:any) => record.id === editingKey;
  // const [data,setData]=useState<dataAPI.Assignment[]>([])
  // useEffect(()=>{
  //   getStudentInfoById(userId).then((res)=>{
  //     if(res?.code===1){
  //       setData(res.data.assignments)
  //     }
  //   })
  // },[])

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      console.log('row',id,row)
      let newData=datas||data.assignments
      newData=[...newData];
      const index = newData.findIndex((item:Item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const params={...item,...row}
        console.log('item',params)

        setChangeLoading(true)
        let res=await changeOneWork(params)
        setChangeLoading(false)
        if(res?.code===0){
          message.success('保存成功')
        }else{
          message.error(res?.msg);
        }
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        console.log('datas',datas)
        setEditingKey('');
      } else{
        message.error('保存失败')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns: ProColumns<dataAPI.Assignment>[] = [
    {
      title: '作业次数',
      dataIndex: 'time',
      tooltip: '第几次作业',
      editable: false,
    },
    {
      title: '分数',
      dataIndex: 'score',
      tooltip: '作业分数',
      editable:true,
      width: '30%',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_,record:any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{marginRight: 8}}>
              保存
            </Typography.Link>
            <Popconfirm title="确定取消编辑吗" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
        );
      },
    },
  ];

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
                                                       editing,
                                                       dataIndex,
                                                       title,
                                                       inputType,
                                                       record,
                                                       index,
                                                       children,
                                                       ...restProps
                                                     }) => {
    const inputNode = <InputNumber min={0} max={100}/>

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入正确的分数`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Spin spinning={loading || changLoading}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            // loading={loading || changLoading}
            bordered
            dataSource={datas||data?.assignments}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          >

          </Table>
        </Form>
      </Spin>
    </>
  )
}
export default editTable;
