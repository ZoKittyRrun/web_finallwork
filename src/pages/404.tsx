import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="别随便输入地址，这里什么都没有。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        回到主页
      </Button>
    }
  />
);

export default NoFoundPage;
