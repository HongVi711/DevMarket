const authService = require('../services/user.services');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Vui lòng cung cấp tên, email và mật khẩu', 400));
  }

  const { user, message } = await authService.register(
    { name, email, password },
    req.protocol,
    req.get('host')
  );

  res.status(201).json({
    status: 'success',
    data: { user },
    message,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Vui lòng cung cấp email và mật khẩu', 400));
  }

  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { user, token: jwtToken } = await authService.verifyEmail(token);

  res.status(200).json({
    status: 'success',
    data: { user, token: jwtToken },
    message: 'Xác thực email thành công',
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: authService.logout(),
  });
});

exports.resendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Vui lòng cung cấp email', 400));
  }

  const { message } = await authService.resendVerificationEmail(email, req.protocol, req.get('host'));

  res.status(200).json({
    status: 'success',
    message,
  });
});