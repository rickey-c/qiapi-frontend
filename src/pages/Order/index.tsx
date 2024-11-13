import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { listOrderUsingGet, deleteOrderUsingPost, updateOrderUsingPost } from '@/services/qiapi-order/orderController';

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<API.Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingOrder, setEditingOrder] = useState<API.Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await listOrderUsingGet({});
      if (response.code === 0) {
        setOrders(response.data.records);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      const response = await deleteOrderUsingPost({ id: orderId });
      if (response.code === 0) {
        message.success('订单删除成功');
        fetchOrders();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEdit = (order: API.Order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values: API.OrderUpdateRequest) => {
    try {
      const response = await updateOrderUsingPost(values);
      if (response.code === 0) {
        message.success('订单更新成功');
        setIsModalVisible(false);
        fetchOrders();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    { title: '订单ID', dataIndex: 'id', key: 'id' },
    { title: '订单名称', dataIndex: 'name', key: 'name' },
    { title: '操作', key: 'action', render: (text: any, record: API.Order) => (
      <>
        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
      </>
    ) },
  ];

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="编辑订单"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingOrder && (
          <Form
            initialValues={editingOrder}
            onFinish={handleUpdate}
          >
            <Form.Item
              name="id"
              label="订单ID"
              rules={[{ required: true, message: '请输入订单ID' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label="订单名称"
              rules={[{ required: true, message: '请输入订单名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                更新
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;