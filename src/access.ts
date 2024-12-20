/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: InitialState | undefined) {
  const { loginUser } = initialState ?? {};
  return {
    canUser: Boolean(loginUser),
    canAdmin: loginUser?.userRole === 'admin',
  };
}

