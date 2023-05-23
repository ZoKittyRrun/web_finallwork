import React, {FC, useEffect, useRef, useState} from 'react';
import { Pie } from '@ant-design/plots';
import Throttle from "@antv/util/src/throttle";
import {useUpdateEffect} from "ahooks";

const PieComposition :FC<{
  settings?:adminAPI.settingsRes
  Throttling?:number
}>= ({settings:set,Throttling}) => {
  const [settings,setSettings]=useState<adminAPI.settingsRes>({})
  const clickTimeOut=useRef();
  //清除点击计时器
  const clearClickTimeOut=()=>{
    console.log('clickTimeOut',clickTimeOut.current)
    if(clickTimeOut.current){
      clearTimeout(clickTimeOut.current);
      // @ts-ignore
      clickTimeOut.current=null;
    }
  }
  useEffect(()=>{
    if(Throttling){
      setSettings(JSON.parse(JSON.stringify(set)))
    }else{
      setSettings(set)
    }
  },[])
  useUpdateEffect(()=>{
    if(Throttling){
      clearClickTimeOut();
      // @ts-ignore
      clickTimeOut.current=setTimeout(()=>{
        setSettings(JSON.parse(JSON.stringify(set)))
        console.log(set,'set')
      },Throttling)
    }else{
      setSettings(set)
    }
  },[JSON.stringify(set)])
  const data = [
    {
      type: '平时分数占比',
      value: settings.daily_score,
    },
    {
      type: '期末考试分数占比',
      value: settings.examination_score,
    },
    {
      type: '作业分数占比',
      value: settings.assignments_score,
    },
    {
      type: '期中测试占比',
      value: settings.middle_score,
    },
    {
      type: '讲评分数占比',
      value: settings.review_score,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    legend: false,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  // @ts-ignore
  return <Pie {...config} />;
};

export default PieComposition;
