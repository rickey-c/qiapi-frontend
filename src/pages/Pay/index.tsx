import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Button, Card, Form, message, Radio, Input, Divider } from 'antd';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 表单提交处理函数
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 假设这是你的支付请求逻辑
      const response = await mockPaymentRequest(values);
      if (response.success) {
        message.success('充值成功！');
      } else {
        message.error('充值失败，请重试。');
      }
    } catch (error) {
      message.error('请求失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 模拟支付请求的函数
  const mockPaymentRequest = async (values: any) => {
    // 这里可以替换为真实的支付请求逻辑
    console.log('支付信息:', values);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 2000);
    });
  };

  return (
    <PageContainer title="充值界面">
      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="支付方式" name="paymentMethod" rules={[{ required: true, message: '请选择支付方式' }]}>
            <Radio.Group>
              <Radio value="wechat">微信支付</Radio>
              <Radio value="alipay">支付宝支付</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="充值金额" name="amount" rules={[{ required: true, message: '请输入充值金额' }]}>
            <Input placeholder="请输入充值金额" />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              充值
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="充值结果" loading={loading}>
        {/* 这里可以显示充值结果 */}
      </Card>
    </PageContainer>
  );
};

export default Index;
