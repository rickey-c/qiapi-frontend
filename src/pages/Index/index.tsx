import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { List, message, Card, Row, Col } from 'antd';
import { listInterfaceInfoByPageUsingGet } from '@/services/qiapi-backend/interfaceInfoController';
import styles from './index.css';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      // 列出接口信息
      const res = await listInterfaceInfoByPageUsingGet({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="在线接口开放平台">
      <List
        className={styles.list}
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item>
              <Card className={styles.card} actions={[<a key={item.id} href={apiLink}>查看</a>]}>
                <Card.Meta
                  title={<a href={apiLink}>{item.name}</a>}
                  description={item.description}
                />
              </Card>
            </List.Item>
          );
        }}
        pagination={{
          showTotal: (total) => `总数：${total}`,
          pageSize: 5,
          total,
          onChange: (page, pageSize) => {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;