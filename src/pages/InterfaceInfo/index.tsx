import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, message, Input, Divider, Modal, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  getInterfaceInfoByIdUsingGet,
  getRandomEncouragementUsingGet,
  getUserNameByPostUsingPost,
} from '@/services/qiapi-backend/interfaceInfoController';
import { addOrderUsingPost } from '@/services/qiapi-order/orderController';
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

  // 处理请求的函数，根据请求方法和URL动态执行请求
  const handleRequest = async (method: string, requestUrl: string, values: any) => {
    const requestMap: { [key: string]: Function } = {
      // 处理 GET 请求
      GET: async (url: string) => {
        // 如果requestUrl是获取随机鼓励话语的接口
        if (requestUrl.endsWith('/random/encouragement')) {
          return await getRandomEncouragementUsingGet(); // 调用该接口，不传递参数
        }
        // 其他处理逻辑返回null
        return null;
      },
      // 处理 POST 请求
      POST: async (url: string) => {
        // 如果requestUrl是获取用户名的接口
        if (requestUrl.endsWith('/name/user')) {
          return await getUserNameByPostUsingPost({
            id: params.id, // 传递 ID 参数
            ...values, // 传递其他请求参数
          });
        }
        // 其他处理逻辑返回null
        return null;
      },
    };
    // 根据请求方法调用相应的请求函数
    const response = await requestMap[method.toUpperCase()](requestUrl);
    return response;
  };

  // 表单提交处理函数
  const onFinish = async (values: any) => {
    if (!data || !data.url || !data.method) {
      message.error('接口URL或请求方法未获取');
      return;
    }

    setInvokeLoading(true); // 设置加载状态为 true
    try {
      const res = await handleRequest(data.method, data.url, values);
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

  // 处理弹窗确认按钮点击事件
  const handleOk = async (values: { quantity: number }) => {
    if (!data) return;
    try {
      // 计算总价格并保留两位小数
      const totalPrice = parseFloat((values.quantity * (data.costPerCall || 0)).toFixed(2));
      const res = await addOrderUsingPost({
        interfaceId: data.id,
        quantity: values.quantity,
        totalPrice, // 使用保留两位小数的总价格
      });
      if (res.data) {
        setOrderId(res.data); // 保存订单ID
        message.success('订单创建成功');
        setIsModalVisible(false);
        // 调用第三方支付接口
        // callThirdPartyPayment(res.data, totalPrice);
      } else {
        message.error('订单创建失败');
      }
    } catch (error: any) {
      message.error('请求失败：' + (error.message || '未知错误'));
    }
  };


  // 调用第三方支付接口
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const callThirdPartyPayment = (orderId: number, totalPrice: number) => {
    // 这里调用第三方支付接口
    console.log(`调用第三方支付接口，订单ID: ${orderId}, 总金额: ${totalPrice}`);
    // 示例代码，可以根据实际情况进行修改
    // thirdPartyPaymentApi.pay({ orderId, totalPrice });
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
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
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