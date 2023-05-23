import React from 'react';
import {Button, Input, Skeleton, Spin, Upload, message, Avatar} from 'antd';
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import {flushSync} from 'react-dom';
import {useRequest} from 'umi';
import {getUserInfo, changeUserInfo} from '@/services/user';

import styles from './Baseview.less';
import {useModel} from "@@/exports";


// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({avatar}: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <Avatar className={styles.avatar} src={avatar} alt="头像地址出错"/>
    </div>
  </>
);

const BaseView: React.FC = () => {
  const {setInitialState} = useModel('@@initialState');
  const {data: currentUser, loading} = useRequest(() => {
    return getUserInfo();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      return currentUser.avatar;
    }
  };


  const handleFinish = async (value: any) => {
    console.log('更新信息', value)
    let obj: userAPI.changeUserInfoParams = {phone: value.phone, avatar: value.avatar, email: value.email}
    let res = await changeUserInfo(obj)
    if (res?.code === 0) {
      message.success(res.msg);
      value.name = value.nickname;
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: value,
        }));
      });
    }
  };
  return (
    <Skeleton loading={loading}>
      <div className={styles.baseView}>
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,

              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="账号名"
                readonly={true}
              />
              <ProFormText
                width="md"
                name="nickname"
                label="昵称"
                readonly={true}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
              />

              <ProFormText
                name="phone"
                label="联系电话"
                rules={[
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号！',
                  },
                ]}
              />
              <ProFormText
                name="avatar"
                label="头像url地址"
                rules={[
                  {
                    required: true,
                    message: '请输入头像url地址!',
                  }
                ]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()}/>
          </div>
        </>
      </div>
    </Skeleton>
  );
};

export default BaseView;
