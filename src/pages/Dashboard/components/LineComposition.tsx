// @ts-ignore
import React, {useState, useEffect, FC} from 'react';
// @ts-ignore
import {Line} from '@ant-design/plots';

const LineComposition: FC<{
  average: dataAPI.Assignment[]
  studentInfo: dataAPI.Assignment[]
  config?:any
}> = ({average, studentInfo, config:newConfig}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < average.length; i++) {
      data.push({
        time: average[i].time.toString(),
        value: average[i].score,
        category: '平均分',
      });

    }
    for(let i=0;i<studentInfo.length;i++){
      data.push({
        time: studentInfo[i].time.toString(),
        value: studentInfo[i].score,
        category: '我的分数',
      });
    }
    console.log('lineData',data)
    setData(data);
  }, []);


  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    min: 0,
    max: 100,
    maxLimit:100,
    meta:{
      range:[0,100]
    },
    ...newConfig
  };

  return <Line {...config} />;
};

export default LineComposition;
