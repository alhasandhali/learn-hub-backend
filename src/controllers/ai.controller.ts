import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const generateFeedback = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.body;
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });

    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    // Mock AI Feedback Generation
    // In a real scenario, you would call OpenAI/Gemini API here
    const mockFeedback = `The submission for "${submission.assignment.title}" looks promising. 
    The implementation of the requirements seems solid, but consider optimizing the code structure for better readability. 
    Status suggestion: ACCEPTED.`;

    await prisma.submission.update({
      where: { id: submissionId },
      data: { aiRefinement: mockFeedback },
    });

    res.status(200).json({ feedback: mockFeedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const refineAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    // Mock AI Assignment Refinement
    const refinedDescription = `Refined Description for ${title}:\n\n${description}\n\nKey Learning Objectives:\n1. Master core concepts.\n2. Implement best practices.\n3. Ensure scalability.`;

    res.status(200).json({ refinedDescription });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
