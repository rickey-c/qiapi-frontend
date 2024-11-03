import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Button, Card, Form, message, Radio, Row, Col } from 'antd';
import styles from './index.css';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 表单提交处理函数
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // TODO 支付逻辑
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
        <h2>欢迎来到充值页面！</h2>
        <p>请选择支付方式和充值计划，点击充值按钮完成支付。</p>
        <p>温馨提示：充值金额越多性价比越高！</p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="支付方式" name="paymentMethod" rules={[{ required: true, message: '请选择支付方式' }]}>
            <Radio.Group>
              <Radio value="wechat">微信支付</Radio>
              <Radio value="alipay">支付宝支付</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="充值计划" name="plan" rules={[{ required: true, message: '请选择充值计划' }]}>
            <Radio.Group className={styles.planGroup}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Radio.Button value="first" className={styles.planCard}>
                    <h3>充值5元</h3>
                    <p>获得10次调用次数</p>
                  </Radio.Button>
                </Col>
                <Col span={8}>
                  <Radio.Button value="second" className={styles.planCard}>
                    <h3>充值25元</h3>
                    <p>获得60次调用次数</p>
                  </Radio.Button>
                </Col>
                <Col span={8}>
                  <Radio.Button value="third" className={styles.planCard}>
                    <h3>充值50元</h3>
                    <p>获得125次调用次数</p>
                  </Radio.Button>
                </Col>
                <Col span={8}>
                  <Radio.Button value="fourth" className={styles.planCard}>
                    <h3>充值100元</h3>
                    <p>获得260次调用次数</p>
                  </Radio.Button>
                </Col>
                <Col span={8}>
                  <Radio.Button value="fifth" className={styles.planCard}>
                    <h3>充值328元</h3>
                    <p>获得700次调用次数</p>
                  </Radio.Button>
                </Col>
                <Col span={8}>
                  <Radio.Button value="sixth" className={styles.planCard}>
                    <h3>充值648元</h3>
                    <p>获得1500次调用次数</p>
                  </Radio.Button>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              充值
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Index;