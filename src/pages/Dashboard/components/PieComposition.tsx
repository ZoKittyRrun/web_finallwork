import { Pie } from '@ant-design/plots';
import { useUpdateEffect } from 'ahooks';
import { FC, useEffect, useRef, useState } from 'react';

const PieComposition: FC<{
  settings?: adminAPI.settingsRes;
  Throttling?: number;
}> = ({ settings: set, Throttling }) => {
  const [settings, setSettings] = useState<adminAPI.settingsRes>({});
  const clickTimeOut = useRef();
  //清除点击计时器
  const clearClickTimeOut = () => {
    console.log('clickTimeOut', clickTimeOut.current);
    if (clickTimeOut.current) {
      clearTimeout(clickTimeOut.current);
      // @ts-ignore
      clickTimeOut.current = null;
    }
  };
  useEffect(() => {
    if (Throttling) {
      setSettings(JSON.parse(JSON.stringify(set)));
    } else {
      setSettings(set);
    }
  }, []);
  useUpdateEffect(() => {
    if (Throttling) {
      clearClickTimeOut();
      // @ts-ignore
      clickTimeOut.current = setTimeout(() => {
        setSettings(JSON.parse(JSON.stringify(set)));
        console.log(set, 'set');
      }, Throttling);
    } else {
      setSettings(set);
    }
  }, [JSON.stringify(set)]);
  const data = [
    {
      type: '碳水化合物',
      value: settings.daily_score,
    },
    {
      type: '脂类',
      value: settings.examination_score,
    },
    {
      type: '蛋白质',
      value: settings.assignments_score,
    },
    {
      type: '水',
      value: settings.middle_score,
    },
    {
      type: '膳食纤维',
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
