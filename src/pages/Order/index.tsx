import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { listOrderByPageUsingGet, deleteOrderUsingPost, updateOrderUsingPost } from '@/services/qiapi-order/orderController';

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<API.Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingOrder, setEditingOrder] = useState<API.Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fetchOrders(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchOrders = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await listOrderByPageUsingGet({ current: page, pageSize: size });
      if (response.code === 0) {
        if (response.data && response.data.records) {
          setOrders(response.data.records);
        } else {
          setOrders([]);
        }
        setTotal(response.data?.total ?? 0);
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
        fetchOrders(currentPage, pageSize);
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

  const handleUpdate = async (values: { quantity: number }) => {
    if (editingOrder) {
      const updatedOrder = { ...editingOrder, quantity: values.quantity };
      try {
        const response = await updateOrderUsingPost(updatedOrder);
        if (response.code === 0) {
          message.success('订单更新成功');
          setIsModalVisible(false);
          fetchOrders(currentPage, pageSize);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error('更新失败');
      }
    }
  };

  const columns = [
    { title: '订单ID', dataIndex: 'id', key: 'id' },
    { title: '接口ID', dataIndex: 'interfaceId', key: 'interfaceId' },
    { title: '购买次数', dataIndex: 'quantity', key: 'quantity' },
    { title: '总金额', dataIndex: 'totalPrice', key: 'totalPrice' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: number) => (status === 0 ? '未支付' : '已支付') },
    { title: '操作', key: 'action', render: (text: any, record: API.Order) => (
      <>
        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="link" danger onClick={() => record.id !== undefined && handleDelete(record.id)}>删除</Button>
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
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
      />
      <Modal
        title="编辑订单"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingOrder && (
          <Form
            initialValues={{ quantity: editingOrder.quantity }}
            onFinish={handleUpdate}
          >
            <Form.Item
              name="quantity"
              label="购买次数"
              rules={[{ required: true, message: '请输入购买次数' }]}
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