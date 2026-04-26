import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller';
import {
  submitAssignment,
  getSubmissionsByAssignment,
  updateSubmissionStatus,
  getStudentSubmissions,
  getInstructorSubmissions,
} from '../controllers/submission.controller';
import { generateFeedback, refineAssignment } from '../controllers/ai.controller';
import { login, me, signup } from '../controllers/auth.controller';

const router = Router();

// Assignments
router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignmentById);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);

// Submissions
router.post('/submissions', submitAssignment);
router.get('/submissions/assignment/:assignmentId', getSubmissionsByAssignment);
router.patch('/submissions/:id/status', updateSubmissionStatus);
router.get('/submissions/student/:studentId', getStudentSubmissions);
router.get('/submissions/instructor/:instructorId', getInstructorSubmissions);

// AI Utility
router.post('/ai/feedback', generateFeedback);
router.post('/ai/refine', refineAssignment);

// Auth
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.get('/auth/me/:id', me);

export default router;
