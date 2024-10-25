import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, Card, Descriptions, Form, message, Input, Divider} from 'antd';
import {
  getInterfaceInfoByIdUsingGet,
  getRandomEncouragementUsingGet,
  getUserNameByPostUsingPost,
} from '@/services/qiapi-backend/interfaceInfoController';
import { useParams } from '@@/exports';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [,setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

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



  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
