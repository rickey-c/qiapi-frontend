import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = `Rickey出品   <a href="https://beian.miit.gov.cn/?spm=a2c4g.11186623.0.0.47bb3367VeAeRf#/Integrated/index" target="_blank" rel="noopener noreferrer">闽ICP备2024074555号</a>`;

  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={
        <span dangerouslySetInnerHTML={{ __html: `${currentYear} ${defaultMessage}` }} />
      }
      links={[
        {
          key: 'Rickey',
          title: <span className="no-hover">Rickey's Github </span>,
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        // {
        //   key: 'Rickey接口',
        //   title: 'Rickey接口',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]}
    />
  );
};

export default Footer;
