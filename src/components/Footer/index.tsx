import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'superxmy';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'superxmy',
          title: 'superxmy',
          href: 'https://blog.superxmy.top',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Superxmyang',
          blankTarget: true,
        },
        {
          key: 'superxmy blog',
          title: 'superxmy blog',
          href: 'https://blog.superxmy.top',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
