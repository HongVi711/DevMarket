const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// Tạo JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Gửi email xác thực
exports.sendVerificationEmail = async (userId, protocol, host) => {
  try {
    console.log(`Bắt đầu gửi email xác thực cho userId: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    console.log(`Token xác thực đã tạo cho ${user.email}: ${verificationToken}`);

    const verificationURL = `${protocol}://${host}/api/users/verify-email/${verificationToken}`;
    const message = `Vui lòng xác thực email của bạn bằng cách nhấp vào liên kết này:\n\n${verificationURL}\n\nLiên kết này có hiệu lực trong 24 giờ.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Token xác thực email của bạn (hiệu lực 24 giờ)',
        message,
      });
    } catch (error) {
      console.error(`Lỗi gửi email xác thực cho ${user.email}:`, error.message);
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(`Lỗi khi gửi email xác thực: ${error.message}`, 500);
    }

    return { message: 'Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư của bạn.' };
  } catch (error) {
    console.error('Lỗi trong sendVerificationEmail:', error.message);
    throw error;
  }
};

// Đăng ký người dùng
exports.register = async ({ name, email, password, role, storeName }, protocol, host) => {
  try {
    console.log('Bắt đầu đăng ký:', { name, email, role,storeName });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email đã được sử dụng', 400);
    }

    const validRoles = ['user', 'seller']; 
    const userRole = validRoles.includes(role) ? role : 'user';

    if (userRole === 'seller' && !storeName) {
      throw new AppError('Tên cửa hàng là bắt buộc cho vai trò seller', 400);
    }

    const userData = {
      name,
      email,
      password,
      role: userRole,
    };

    if (userRole === 'seller') {
      userData.storeName = storeName;
    }

    const user = await User.create(userData);
    console.log('Người dùng đã tạo:', user._id);

    try {
      const { message } = await exports.sendVerificationEmail(user._id, protocol, host);
      return { user, message };
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      console.log(`Đã xóa người dùng ${user._id} do lỗi gửi email`);
      throw error;
    }
  } catch (error) {
    console.error('Lỗi trong register:', error.message);
    throw error;
  }
};

// Xác thực email
exports.verifyEmail = async (token) => {
  try {
    console.log('Bắt đầu xác thực email với token:', token.substring(0, 10) + '...');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Token xác thực không hợp lệ hoặc đã hết hạn', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(`Email đã xác thực cho ${user.email}`);

    const jwtToken = signToken(user._id);
    return { user, token: jwtToken };
  } catch (error) {
    console.error('Lỗi trong verifyEmail:', error.message);
    throw error;
  }
};

// Đăng nhập
exports.login = async ({ email, password }) => {
  try {
    console.log('Bắt đầu đăng nhập:', { email });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Email hoặc mật khẩu không đúng', 401);
    }

    if (!user.isVerified) {
      throw new AppError('Vui lòng xác thực email trước khi đăng nhập', 403);
    }

    const token = signToken(user._id);
    console.log(`Đăng nhập thành công cho ${email}`);
    return { user, token };
  } catch (error) {
    console.error('Lỗi trong login:', error.message);
    throw error;
  }
};

// Đăng xuất
exports.logout = () => {
  return { message: 'Đăng xuất thành công' };
};

// Gửi lại email xác thực
exports.resendVerificationEmail = async (email, protocol, host) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }
    if (user.isVerified) {
      throw new AppError('Email đã được xác thực', 400);
    }

    const { message } = await exports.sendVerificationEmail(user._id, protocol, host);
  } catch (error) {
    throw error;
  }
};

// Đổi mật khẩu
exports.changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Tìm người dùng và lấy mật khẩu
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404);
    }

    // Kiểm tra mật khẩu hiện tại
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Mật khẩu hiện tại không đúng', 401);
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });
    
    console.log(`Đổi mật khẩu thành công cho ${user.email}`);
    
    // Tạo token mới sau khi đổi mật khẩu
    const token = signToken(user._id);
    return { 
      message: 'Đổi mật khẩu thành công',
      token 
    };
  } catch (error) {
    console.error('Lỗi trong changePassword:', error.message);
    throw error;
  }
};





