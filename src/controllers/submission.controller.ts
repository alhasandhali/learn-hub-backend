import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const submissionSchema = z.object({
  studentId: z.string(),
  assignmentId: z.string(),
  url: z.string().min(1),
  notes: z.string().optional(),
});

const feedbackSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'NEEDS_IMPROVEMENT']),
  feedback: z.string().optional(),
});

export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const validatedData = submissionSchema.parse(req.body);
    console.log("Creating submission:", validatedData);
    const submission = await prisma.submission.create({
      data: {
        ...validatedData,
        status: 'PENDING',
      },
    });
    res.status(201).json(submission);
  } catch (error: any) {
    console.error('Submission validation error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getSubmissionsByAssignment = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.assignmentId as string;
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { select: { name: true, email: true } },
      },
    });
    res.status(200).json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = feedbackSchema.parse(req.body);
    const submission = await prisma.submission.update({
      where: { id },
      data: validatedData,
    });
    res.status(200).json(submission);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStudentSubmissions = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    console.log("Fetching submissions for student:", studentId);
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: true,
        student: { select: { name: true, email: true } }
      },
      orderBy: { submittedAt: 'desc' },
    });
    console.log(`Found ${submissions.length} submissions for student`);
    res.status(200).json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInstructorSubmissions = async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId as string;
    console.log("Fetching submissions for instructor:", instructorId);
    const submissions = await prisma.submission.findMany({
      where: {
        assignment: {
          instructorId: instructorId
        }
      },
      include: {
        student: { select: { name: true, email: true } },
        assignment: { select: { title: true } }
      },
      orderBy: { submittedAt: 'desc' }
    });
    console.log(`Found ${submissions.length} submissions for instructor`);
    res.status(200).json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
