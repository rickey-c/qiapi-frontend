import { PageContainer } from '@ant-design/pro-layout/es/components/PageContainer';
import React, { useEffect, useState, useCallback } from 'react';
import { List, message, Card, Button, Modal, InputNumber, Form, Alert } from 'antd';
import { listInterfaceInfoByPageUsingGet } from '@/services/qiapi-backend/interfaceInfoController';
import { applyForApiCallIncreaseUsingPost } from '@/services/qiapi-backend/userInterfaceInfoController';
import styles from './index.css';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false); // 初始状态设置为非加载状态
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  /**
   * 加载接口数据
   * @param current 当前页码
   * @param pageSize 每页数据条数
   */
  const loadData = useCallback(async (current = 1, pageSize = 6) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGet({ current, pageSize });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error(`加载接口信息失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 页面挂载时加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 下载 SDK
   */
  const downloadSdk = () => {
    const link = document.createElement('a');
    link.href = 'http://124.222.215.143:8090/api/interfaceInfo/sdk'; // 直接调用下载链接
    link.setAttribute('download', 'qiapi-client-sdk-0.0.1.jar'); // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  /**
   * 申请接口调用次数
   */
  const applyForApiCallIncrease = async (values: { interfaceInfoId: number; invokeCount: number }) => {
    if (values.invokeCount >= 100) {
      message.error('调用次数必须小于100次');
      return;
    }
    setLoading(true);
    try {
      const response = await applyForApiCallIncreaseUsingPost(values);
      if (response.data) {
        message.success('申请成功');
        setIsModalVisible(false);
      } else {
        message.error('申请失败');
      }
    } catch (error: any) {
      message.error('请求失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="在线接口开放平台">
      {/* 接口信息展示 */}
      <List
        className={styles.list}
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item>
              <Card
                className={styles.card}
                actions={[<a key={item.id} href={apiLink}>查看</a>]}
              >
                <Card.Meta
                  title={<a href={apiLink}>{item.name}</a>}
                  description={item.description}
                />
              </Card>
            </List.Item>
          );
        }}
        pagination={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal: (total) => (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Button type="primary" onClick={downloadSdk} style={{ marginRight: 16 }}>
                下载 SDK
              </Button>
              <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginRight: 16 }}>
                免费申请接口调用次数
              </Button>
              <span>总数：{total}</span>
            </div>
          ),
          pageSize: 6,
          total,
          onChange: (page, pageSize) => loadData(page, pageSize),
        }}
      />
      <Modal
        title="申请接口调用次数"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Alert message="规则：您的接口调用次数要小于100次，且接口为免费接口" type="info" showIcon style={{ marginBottom: 16 }} />
        <Form form={form} onFinish={applyForApiCallIncrease}>
          <Form.Item
            name="interfaceInfoId"
            label="接口ID"
            rules={[{ required: true, message: '请输入接口ID' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="invokeCount"
            label="调用次数"
            rules={[{ required: true, message: '请输入调用次数' }]}
          >
            <InputNumber min={1} max={99} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              申请
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Index;
