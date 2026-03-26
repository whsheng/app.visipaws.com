// Middleware 已简化 - 不再需要多语言路由
// 如需添加认证等中间件，可在此处添加

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
