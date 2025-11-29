import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * POST /api/auth/login
 * Login user
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập email và mật khẩu / Please enter email and password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng / Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (in production, compare hashed passwords!)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng / Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isVerified: user.isVerified,
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Đăng nhập thành công / Login successful',
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server / Server error' },
      { status: 500 }
    );
  }
}

