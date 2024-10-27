import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#13C2C2',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Qi-API',
  "splitMenus": false,
  pwa: false,
  "siderMenuType": "sub",
  logo: '/qi-api-logo.svg',
  iconfontUrl: '',
};

export default Settings;
