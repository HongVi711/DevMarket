const authService = require('../services/user.services');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, storeName} = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Vui lòng cung cấp tên, email và mật khẩu', 400));
  }

  if (role === 'seller' && !storeName) {
    return next(new AppError('Tên cửa hàng là bắt buộc cho vai trò seller', 400));
  }

  const { user, message } = await authService.register(
    { name, email, password, role, storeName },
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

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới', 400));
  }

  // Giả sử userId được lấy từ middleware xác thực (JWT)
  const userId = req.user._id;
  if (!userId) {
    return next(new AppError('Vui lòng đăng nhập để đổi mật khẩu', 401));
  }

  const { message, token } = await authService.changePassword(userId, currentPassword, newPassword);

  res.status(200).json({
    status: 'success',
    data: { token },
    message,
  });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  // Giả sử req.user đã được thiết lập bởi middleware xác thực (JWT)
  const userId = req.user._id;
  if (!userId) {
    return next(new AppError('Vui lòng đăng nhập để xem thông tin cá nhân', 401));
  }

  // Tìm người dùng trong cơ sở dữ liệu
  const user = await User.findById(userId).select('-password'); // Không trả về mật khẩu
  if (!user) {
    return next(new AppError('Không tìm thấy người dùng', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

