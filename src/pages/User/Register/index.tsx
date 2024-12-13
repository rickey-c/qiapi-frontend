import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { history } from '@umijs/max';
import { userRegisterUsingPost, sendEmailUsingGet } from '@/services/qiapi-backend/userController';
import type { UserRegisterRequest } from '@/services/qiapi-backend/typings';

const Register: React.FC = () => {
  const [form] = Form.useForm(); // 创建表单实例
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const onFinish = async (values: UserRegisterRequest & { code: string }) => {
    console.log('Form values:', values); // 调试输出表单值
    setLoading(true);
    try {
      const response = await userRegisterUsingPost(values);
      console.log('Register response:', response); // 调试输出响应
      if (response.data) {
        message.success('注册成功');
        history.push('/user/login');
      } else {
        message.error('注册失败');
      }
    } catch (error: any) {
      console.error('Register error:', error); // 调试输出错误
      message.error('请求失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const sendEmailCode = async (email: string) => {
    console.log('Sending email code to:', email); // 调试输出邮箱
    setEmailLoading(true);
    try {
      const response = await sendEmailUsingGet({ email });
      console.log('Email code response:', response); // 调试输出响应
      if (response.data) {
        message.success('验证码已发送，请检查您的邮箱');
      } else {
        message.error('发送验证码失败');
      }
    } catch (error: any) {
      console.error('Send email code error:', error); // 调试输出错误
      message.error('请求失败：' + (error.message || '未知错误'));
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <Card title="注册" bordered={false} style={{ width: 400, margin: '0 auto' }}>
      <Form form={form} name="register" onFinish={onFinish}>
        <Form.Item
          name="userAccount"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              const email = form.getFieldValue('email'); // 使用 form 实例获取值
              if (email) {
                sendEmailCode(email);
              } else {
                message.error('请先输入邮箱');
              }
            }}
            loading={emailLoading}
          >
            获取验证码
          </Button>
        </Form.Item>
        <Form.Item
          name="code"
          label="验证码"
          rules={[{ required: true, message: '请输入验证码' }]}
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
