import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { listOrderByPageUsingGet, deleteOrderUsingPost, updateOrderUsingPost } from '@/services/qiapi-order/orderController';
import { alipayUsingPost } from '@/services/qiapi-thirdParty/payController';

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<API.Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingOrder, setEditingOrder] = useState<API.Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
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

  const handlePay = async (order: API.Order) => {
    try {
      const totalPrice = order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : '0.00';
      const paymentResponse = await alipayUsingPost({
        outTradeNo: String(order.id),
        subject: '订单支付',
        totalAmount: totalPrice,
        description: `支付订单 ${order.id}`,
      });

      if (paymentResponse) {
        message.success('支付发起成功，请完成支付！');
        
        // 创建支付表单并提交
        const formContainer = document.createElement('div');
        if (paymentResponse.data) {
          formContainer.innerHTML = paymentResponse.data; // 将支付宝返回的表单HTML放到div中
        } else {
          message.error('支付表单生成失败');
          return;
        }
        document.body.appendChild(formContainer); // 将该div加到页面

        const form = formContainer.querySelector('form');
        if (form) {
          form.submit(); // 提交支付表单，发起支付
        } else {
          message.error('支付表单生成失败');
        }
      } else {
        message.error('支付失败，请稍后重试');
      }
    } catch (error: any) {
      console.error('支付接口调用失败：', error);
      message.error('支付接口调用失败：' + (error.message || '未知错误'));
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
        {record.status === 0 && <Button type="link" onClick={() => handlePay(record)}>支付</Button>}
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
          fetchOrders(page, size); // 确保分页控件更新时重新获取数据
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