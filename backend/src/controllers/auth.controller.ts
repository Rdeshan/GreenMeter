import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body;

    // Verify Google token & get user info
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const profile = await googleRes.json();

    if (!profile.email) return res.status(400).json({ error: 'Invalid Google token' });

    // Find or create user
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        provider: 'google',
        providerId: profile.sub,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
