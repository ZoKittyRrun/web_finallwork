import React,{FC,useEffect,useState} from 'react';
import { Table} from "antd";
import type { ColumnsType } from 'antd/es/table';

type Assignment = {
  time?: number;
  score?: number;
  average?: number;
}

const columns: ColumnsType<Assignment> = [
  {
    title: '作业序号',
    dataIndex: 'time',
    key: 'time',

  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: '平均分',
    dataIndex: 'average',
    key: 'average',
  },
];

const AssignmentsTable:FC<{
  average:dataAPI.Assignment[]
  studentInfo:dataAPI.Assignment[]
}>= ({average,studentInfo}) => {
  const [data,setData]=useState<Assignment[]>([])
  useEffect(()=>{
    const data:Assignment[]=[];
    for (let i = 0; i < studentInfo.length; i++) {
      let obj:Assignment={}
      obj['time']=studentInfo[i].time
      obj['score']=studentInfo[i].score
      for(let j=0;j<average.length;j++){
        if(studentInfo[i].time===average[j].time){
          obj['average']=average[j].score
          break
        }
      }
      data.push(obj)
    }
    setData(data)
  },[])

  return (
     <Table
       dataSource={data}
       columns={columns}
       pagination={{
          pageSize: 7,
       }}
       height={300}
     />
  )
}
export default AssignmentsTable;
