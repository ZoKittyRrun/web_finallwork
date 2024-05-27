import { useState } from 'react';

/*
 * @FilePath: changeTable.tsx
 * @Author: zl
 * @Date: 2024-05-27 22:31:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 22:48:57
 * Copyright: 2024 xxxTech CO.,LTD. All Rights Reserved.
 * @Descripttion:
 */

// 没用到 留着备份

export const changeTable = (value: string, mockData: any) => {
  const [data, setData] = useState(mockData);
  // 根据筛选条件的变化重新获取数据
  const newData = data.filter((item: any) => {
    if (value === '') {
      return true; // 如果筛选条件为空，则返回所有数据
    } else {
      return item.status === value; // 否则只返回符合筛选条件的数据
    }
  });
  // 更新状态以重新渲染表格
  setData(newData);
};
