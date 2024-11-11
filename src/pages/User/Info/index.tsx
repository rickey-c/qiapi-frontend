import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Form, Input, Button, message } from 'antd';
import { history } from '@umijs/max';
import { getLoginUserUsingGet, updateUserUsingPost } from '@/services/qiapi-backend/userController';

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

  const onFinish = async (values: { userName: string; userPassword?: string; confirmPassword?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = values;
      const response = await updateUserUsingPost({ ...user, ...rest });
      if (response.data) {
        message.success('更新成功');
        setUser({ ...user, ...rest });
        history.push('/user/login'); // 更新成功后重定向到登录页面
      } else {
        message.error('更新失败');
      }
    } catch (error: any) {
      message.error('请求失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  return (
    <Card title="个人信息" bordered={false} style={{ width: 400, margin: '0 auto' }}>
      <Form name="updateUser" onFinish={onFinish} initialValues={{ userName: user?.userName }}>
        <Descriptions column={1}>
          <Descriptions.Item label="账号">{user?.userAccount}</Descriptions.Item>
          <Descriptions.Item label="身份">{user?.userRole}</Descriptions.Item>
          <Descriptions.Item label="姓名">
            <Form.Item name="userName" noStyle>
              <Input style={{ fontSize: '14px', padding: '0 4px', height: 'auto' }} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="密码">
            <Form.Item
              name="userPassword"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码长度不能少于8位' },
              ]}
              noStyle
            >
              <Input.Password style={{ fontSize: '14px', padding: '0 4px', height: 'auto' }} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="确认密码">
            <Form.Item
              name="confirmPassword"
              dependencies={['userPassword']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
              noStyle
            >
              <Input.Password style={{ fontSize: '14px', padding: '0 4px', height: 'auto' }} />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            更改个人信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserInfo;