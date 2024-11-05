import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin } from 'antd';
import { getLoginUserUsingGet } from '@/services/qiapi-backend/userController';

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<API.UserVO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getLoginUserUsingGet();
        if (response.data) {
          setUser(response.data);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  return (
    <Card title="个人信息" bordered={false} style={{ width: 400, margin: '0 auto' }}>
      <Descriptions column={1}>
        <Descriptions.Item label="姓名">{user?.userName}</Descriptions.Item>
        <Descriptions.Item label="账号">{user?.userAccount}</Descriptions.Item>
        <Descriptions.Item label="身份">{user?.userRole}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserInfo;