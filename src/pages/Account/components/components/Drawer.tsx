import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message} from 'antd';
import React, {useCallback} from "react";
import {changeNickname, changePassword} from "@/services/user";
import {useModel} from "@@/exports";
import {flushSync} from "react-dom";

type DrawerProps = {
  type: string;
}

const Drawer = ({type}: DrawerProps) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const {setInitialState,initialState} = useModel('@@initialState');
  const ProFormItemPwd: React.FC = useCallback(() => {
    return (
      <>
        <ProFormText.Password
          width="md"
          name="oldPassword"
          label="旧密码"
          placeholder="旧密码"
          rules={[
            {
              required: true,
              message: '请输入旧密码',
            }
          ]}
        />
        <ProFormText.Password
          width="md"
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            }
          ]}
        />
        <ProFormText.Password
          width="md"
          name="checkPassword"
          label="确认密码"
          placeholder="请确认密码"
          rules={[
            {
              validator: async (rule, value) => {
                if (!value) {
                  throw new Error('请输入确认密码');
                } else if (value !== form.getFieldValue('newPassword')) {
                  throw new Error('两次输入密码不匹配!');
                }
              }
            }
          ]}
        />
      </>
    )
  }, [])
  const ProFormItemNickname: React.FC = useCallback(() => {
    return (
        <ProFormText
          width="md"
          name="newNickname"
          label="新昵称"
          placeholder="新昵称"
        />
    )
  }, [])

  const onFinish = async (values: any) => {
    let res:userAPI.response<any>| undefined;
    if(type==='Password'){
      delete values.checkPassword;
      res=await changePassword(values);
      if(res?.code===0){
        message.success(res.msg);
        return true;
      }else{
        return false
      }
    }else{
      res=await changeNickname({value:values.newNickname});
      if(res?.code===0){
        message.success(res.msg);
        flushSync(() => {
          setInitialState((s: any) => ({
            ...s,
            currentUser: {...initialState?.currentUser,name:values.newNickname} ,
          }));
        });
        return true;
      }else {
        return false
      }
    }
  }

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title={type === 'Password' ? '修改密码' : '修改昵称'}
      trigger={
        <a key={type}>修改</a>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={onFinish}
    >
      {type==='Password'?<ProFormItemPwd/>:<ProFormItemNickname/> }

    </ModalForm>
  );
};
// @ts-ignore
export default Drawer;
