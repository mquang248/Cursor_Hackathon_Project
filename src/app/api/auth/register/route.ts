import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, handle } = await request.json();

    // Validation
    if (!email || !password || !name || !handle) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin / Please fill all fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự / Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email đã được sử dụng / Email already exists' },
        { status: 400 }
      );
    }

    // Check if handle already exists
    const existingHandle = await User.findOne({ handle: handle.toLowerCase() });
    if (existingHandle) {
      return NextResponse.json(
        { success: false, error: 'Handle đã được sử dụng / Handle already exists' },
        { status: 400 }
      );
    }

    // Create user (in production, hash the password!)
    const user = await User.create({
      email: email.toLowerCase(),
      password, // TODO: Hash password in production!
      name,
      handle: handle.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${handle}`,
      bio: '',
      isVerified: false,
    });

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
      message: 'Đăng ký thành công / Registration successful',
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server / Server error' },
      { status: 500 }
    );
  }
}

