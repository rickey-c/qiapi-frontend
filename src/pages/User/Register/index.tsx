import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { history } from '@umijs/max';
import { userRegisterUsingPost } from '@/services/qiapi-backend/userController';
import { UserRegisterRequest } from '@/services/qiapi-backend/typings';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: UserRegisterRequest) => {
    setLoading(true);
    try {
      const response = await userRegisterUsingPost(values);
      if (response.data) {
        message.success('注册成功');
        history.push('/user/login');
      } else {
        message.error('注册失败');
      }
    } catch (error: any) {
      message.error('请求失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="注册" bordered={false} style={{ width: 400, margin: '0 auto' }}>
      <Form name="register" onFinish={onFinish}>
        <Form.Item
          name="userAccount"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="userPassword"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="checkPassword"
          label="确认密码"
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
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;