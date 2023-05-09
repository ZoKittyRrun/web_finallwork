import React, {FC, useEffect, useState} from 'react';
import {getStudentInfoById} from "@/services/data";
import {Spin, Tabs} from "antd";
import type {TabsProps} from "antd";
import EditTable from "@/pages/Admin/editInfo/components/editTable";
import EditOtherScore from "@/pages/Admin/editInfo/components/editOtherScore";


const editModal: FC<{
  userId: number
}> = ({userId}) => {
  const [data, setData] = useState<dataAPI.studentInfo>()
  const [loading,setLoading]=useState(true)
  useEffect(() => {
    getStudentInfoById(userId).then((res) => {
      if (res?.code === 0) {
        setData(res.data)
        console.log('data', res.data)
        setLoading(false)
      }
    })
  }, [])
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `修改作业成绩`,
      children: <EditOtherScore data={data} userId={userId}/>,
    },
    {
      key: '2',
      label: `修改其他成绩`,
      children: <EditTable userId={userId}/>,
    },
  ];

  return (
    <div style={{height: '500px'}}>
      <Spin spinning={loading}>
        <h3>{data?.nickname}</h3>
        <Tabs
          items={items}
          type="card"
          tabBarGutter={8}
        >
        </Tabs>

      </Spin>
    </div>

  )

}

export default editModal;
