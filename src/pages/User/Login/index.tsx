import Footer from '@/components/Footer';
import {login ,register} from '@/services/user/index';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history, useModel} from '@umijs/max';
import { message, Tabs} from 'antd';
import React, {useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';



const LoginPage: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const form=useRef();
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  /**
   * 获取用户信息
   * */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      console.log('userInfo',userInfo);
      userInfo.name=userInfo?.nickname;
      userInfo.avatar= userInfo.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const Login = async (values: userAPI.LoginParams) => {
    try {
      // 登录
      const msg = await login(values);
      if (msg===undefined){return}
      if (msg.code === 0) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        console.log('urlParams',urlParams);
        history.push(  '/');
        return;
      }else{
        throw new Error(msg.msg);
      }
    } catch (error) {
      // setUserLoginState(true);
    }
  };

  const Register=async (values: userAPI.RegisterParams)=>{
      // 登录
      const msg = await register(values);
      if (msg===undefined){return}
      if (msg.code === 0) {
        message.success('注册成功！');
        setType('account')
        return;
      }
  }
  const handleSubmit = async (values:any) => {
    if(type==='account') {
      await Login(values as unknown as userAPI.LoginParams );
    }else{
      await Register(values as unknown as userAPI.RegisterParams)
    }
  }
  // @ts-ignore
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      {/*<Lang/>*/}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          formRef={form}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{ searchConfig: { submitText: type==='account'?'登录':'注册'}}}
          logo={<img alt="logo" src="/mao.png"/>}
          title="课程管理系统"
          subTitle={'世界上最好的课程管理系统'}
          initialValues={{
            autoLogin: true,
          }}

          onFinish={handleSubmit}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              {
                key: 'register',
                label: '注册',
              },
            ]}
          />


          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}

          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                name="username"
                placeholder={'请输入账号(学号)'}
                rules={[
                  {
                    required: true,
                    message: '账号必填！',
                  },
                  {
                    type: 'string',
                    len:13,
                    pattern:/^\d{13}$/,
                    message: '请输入13位学号！',
                  },

                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                name="nickname"
                placeholder={'请输入昵称'}
                rules={[
                  {
                    required: true,
                    message: '昵称是必填项！',
                  },
                  {
                    type: 'string',
                    max:10,
                    message:'昵称最长10位'
                  }
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: '不合法的手机号！',
                  // },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="password"
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },

                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: '不合法的手机号！',
                  // },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="confirmpassword"
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    validator: async (rule, value) => {
                      //@ts-ignore
                      if (value !== form?.current?.getFieldValue('password')) {
                        // console.log('value',form.getFieldValue('password'))
                        throw new Error('两次密码不一致!');
                      }
                    },

                  }
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: '不合法的手机号！',
                  // },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default LoginPage;
