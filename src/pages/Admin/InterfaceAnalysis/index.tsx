import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { listTopInvokeInterfaceInfoUsingGet } from "@/services/qiapi-backend/analysisController";
import styles from './index.css';

/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {

  const [data, setData] = useState<API.InterfaceInfo[]>([]);

  useEffect(() => {
    try {
      listTopInvokeInterfaceInfoUsingGet().then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
    } catch (e: any) {
      message.error('请求失败，' + e.message);
    }
  }, []);

  // 映射：{ value: 1048, name: 'Search Engine' },
  const chartData = data.map(item => {
    return {
      value: item.invokedCount,
      name: item.name,
    };
  });

  const option = {
    title: {
      text: '调用次数最多的接口TOP3',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <PageContainer>
      <div className={styles.chartContainer}>
        <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
      </div>
    </PageContainer>
  );
};

export default InterfaceAnalysis;