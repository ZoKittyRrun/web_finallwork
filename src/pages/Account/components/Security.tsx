import React from 'react';
import { List } from 'antd';
import Drawer from "./components/Drawer";
import {useModel} from "@@/exports";

type Unpacked<T> = T extends (infer U)[] ? U : T;





const SecurityView: React.FC = () => {
  const getData = () => [
    {
      title: '账户密码',
      description: '用户登录密码',
      actions: [<Drawer key={'changePassword'} type={'Password'}/>],
    },
    {
      title: '昵称',
      description: '用户显示昵称',
      actions: [<Drawer key={'changeNickname'} type={'Nickname'}/>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description}  />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
