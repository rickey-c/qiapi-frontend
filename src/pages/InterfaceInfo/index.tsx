import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, message, Input, Divider, Modal, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost,
} from '@/services/qiapi-backend/interfaceInfoController';
import { addOrderUsingPost } from '@/services/qiapi-order/orderController';
import { alipayUsingPost } from '@/services/qiapi-thirdParty/payController';
import { useParams } from '@@/exports';
import styles from './index.css';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0); // 添加 totalCost 状态
  const [orderId, setOrderId] = useState<number | null>(null); // 添加 orderId 状态

  // 获取接口信息的url
  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 处理请求的函数，统一调用接口
  const handleRequest = async (values: any) => {
    return await invokeInterfaceInfoUsingPost({
      id: params.id, // 传递 ID 参数
      userRequestParams: values.userRequestParams, // 传递请求参数
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const callThirdPartyPayment = async (orderId: number, totalPrice: number) => {
    try {
      const paymentResponse = await alipayUsingPost({
        outTradeNo: String(orderId), // 使用订单 ID 作为交易号
        subject: data?.name || '测试接口', // 接口名称作为支付主题
        totalAmount: totalPrice.toFixed(2), // 确保金额为两位小数
        description: `购买${data?.name}接口的调用次数`, // 支付描述
      });

      if (paymentResponse) {
        message.success('支付发起成功，请完成支付！');
        // 自动提交支付表单
        const formContainer = document.createElement('div');
        formContainer.innerHTML = paymentResponse.data || ''; // 将支付宝返回的表单HTML放到div中，提供默认值
        document.body.appendChild(formContainer);
        const form = formContainer.querySelector('form');
        if (form) {
          form.submit();
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

  // 表单提交处理函数
  const onFinish = async (values: any) => {
    if (!data || !data.url || !data.method) {
      message.error('接口URL或请求方法未获取');
      return;
    }

    setInvokeLoading(true); // 设置加载状态为 true
    try {
      const res = await handleRequest(values);
      if (res) {
        setInvokeRes(res.data); // 设置返回结果
        message.success('请求成功'); // 提示请求成功
      } else {
        message.error('无效的请求'); // 如果没有有效响应，提示错误
      }
    } catch (error: any) {
      message.error('操作失败，' + error.message); // 提示请求失败
    } finally {
      setInvokeLoading(false); // 结束加载状态
    }
  };

  // 处理购买按钮点击事件
  const handlePurchase = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (values: { quantity: number }) => {
    if (!data) return;
    try {
      const totalPrice = parseFloat((values.quantity * (data.costPerCall || 0)).toFixed(2));
      const res = await addOrderUsingPost({
        interfaceId: data.id,
        quantity: values.quantity,
        totalPrice,
      });

      if (res.data) {
        setOrderId(res.data); // 保存订单ID
        message.success('订单创建成功');
        setIsModalVisible(false);

        // 调用第三方支付接口
        await callThirdPartyPayment(res.data, totalPrice);
      } else {
        message.error('订单创建失败');
      }
    } catch (error: any) {
      message.error('请求失败：' + (error.message || '未知错误'));
    }
  };

  // 处理弹窗取消按钮点击事件
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 处理购买次数变化事件
  const handleQuantityChange = (value: number | null) => {
    if (value !== null && data && data.costPerCall) {
      setTotalCost(value * data.costPerCall);
    }
  };

  return (
    <PageContainer title="查看接口文档">
      <Card className={styles.card}>
        {data ? (
          <Descriptions title={data.name} column={1} extra={<Button type="primary" onClick={handlePurchase}>购买接口</Button>}>
            <Descriptions.Item label='接口ID'>{data.id}</Descriptions.Item>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="客户端SDK">{data.sdk}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
            <Descriptions.Item label="每次调用费用">{data.costPerCall}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="在线测试" className={styles.card}>
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit" loading={invokeLoading}>
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" className={styles.card}>
        {invokeRes}
      </Card>
      <Modal
        title="购买接口"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="接口名称">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="接口状态">{data?.status ? '开启' : '关闭'}</Descriptions.Item>
          <Descriptions.Item label="每次调用费用">{data?.costPerCall}</Descriptions.Item>
        </Descriptions>
        <Form name="purchase" onFinish={handleOk} layout="vertical">
          <Form.Item
            name="quantity"
            label="购买次数"
            rules={[
              { required: true, message: '请输入购买次数' },
              { type: 'number', min: 1, max: 10000, message: '购买次数必须为1到10000之间的数字' },
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <InputNumber
              min={1}
              max={10000}
              parser={(value) => {
                const parsedValue = value?.replace(/[^\d]/g, '');
                if (parsedValue === '') {
                  return NaN;
                }
                const numberValue = Number(parsedValue);
                if (isNaN(numberValue)) {
                  return NaN;
                }
                return numberValue;
              }} // 只保留数字
              formatter={(value) => value ? String(value).replace(/[^\d]/g, '') : ''} // 显示为数字格式
              onChange={handleQuantityChange}
            />
          </Form.Item>

          <Form.Item
            label="总费用"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Input value={totalCost} readOnly style={{ width: '150px' }} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确认购买
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Index;