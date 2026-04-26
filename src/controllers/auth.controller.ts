import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    
    // Convert frontend role to backend role
    const backendRole = role ? role.toUpperCase() : 'STUDENT';
    
    // First try to find by email
    let user = null;
    if (email) {
      user = await prisma.user.findFirst({
        where: { email, role: backendRole }
      });
    }
    
    // If no email provided or not found, just get the first user of that role (for demo purposes)
    if (!user) {
      const fallbackEmail = role === 'instructor' ? 'instructor@example.com' : 'student@example.com';
      user = await prisma.user.findFirst({
        where: { email: fallbackEmail }
      });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'No user found in database for this role' });
    }

    // Validate password if user has one (demo users might not)
    if (user.password && password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      }
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};
