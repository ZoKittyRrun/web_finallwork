import React, {FC} from 'react';
import {PageContainer} from '@ant-design/pro-components';
import {getAllStudents} from "@/services/data";
import {useRequest} from "umi";
import {Avatar, Card, List} from "antd";





const ListStudent: FC<{
  setSelectedStudent: (id: number) => void
}> = ({setSelectedStudent}) => {

  const {data:allStudent,loading} = useRequest(()=>{
    return getAllStudents()
  });

  const clickItem = (id:number)=>{
    return ()=>{
      setSelectedStudent(id)
    }
  }

  return (
    <PageContainer>
      <Card>
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={allStudent}
          renderItem={(item) => {
            console.log(item)
            return(
              <List.Item  onClick={clickItem(item.userId)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<div>{item.nickname}</div>}
                  description={item.username}
                />
              </List.Item>
            )}}
        />
      </Card>
    </PageContainer>
  )
}
export default ListStudent;
