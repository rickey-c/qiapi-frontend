import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { GithubOutlined } from '@ant-design/icons';

const Footer: React.FC = () => {
  const defaultMessage = '闽ICP备2024074555号';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Rickey',
          // eslint-disable-next-line react/no-unescaped-entities
          title: <span className="no-hover">Rickey's Github </span>,
          blankTarget: true,
          href: 'https://github.com/rickey-c'
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/rickey-c',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;