import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import './Footer.css'; // 引入CSS文件

const Footer: React.FC = () => {
  const defaultMessage = `Rickey出品   <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">闽ICP备2024074555号</a>`;
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <DefaultFooter
        className="footer-content"
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
        ]}
      />
    </div>
  );
};

export default Footer;
