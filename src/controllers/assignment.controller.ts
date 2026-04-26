import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const assignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  deadline: z.string().pipe(z.coerce.date()),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  instructorId: z.string(),
});

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const validatedData = assignmentSchema.parse(req.body);
    const assignment = await prisma.assignment.create({
      data: validatedData,
    });
    res.status(201).json(assignment);
  } catch (error: any) {
    console.error('Assignment validation error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        instructor: {
          select: { name: true, email: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            student: { select: { name: true, email: true } },
          },
        },
      },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = assignmentSchema.partial().parse(req.body);
    const assignment = await prisma.assignment.update({
      where: { id },
      data: validatedData,
    });
    res.status(200).json(assignment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.assignment.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
