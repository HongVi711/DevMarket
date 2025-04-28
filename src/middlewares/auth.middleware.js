const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Vui lòng đăng nhập để truy cập', 401));
  }
  
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn', 401));
  }

  // Kiểm tra người dùng tồn tại
  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!user) {
    return next(new AppError('Người dùng không tồn tại', 401));
  }

  // Kiểm tra xem mật khẩu có thay đổi sau khi token được cấp hay không
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < changedTimestamp) {
      return next(new AppError('Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại', 401));
    }
  }

  // Kiểm tra email đã được xác thực
  if (!user.isVerified) {
    return next(new AppError('Vui lòng xác thực email trước khi truy cập', 403));
  }

  req.user = user;
  next();
});

// Middleware hạn chế theo vai trò
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện hành động này', 403));
    }
    next();
  };
};

