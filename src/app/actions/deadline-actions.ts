'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import {
  createDeadline,
  deleteDeadline,
  getDeadlineById,
  getSubjectBySlug,
  getSubjects,
  toggleDeadlineCompletion
} from '@/lib/data';
import { Deadline } from '@/types';

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function toggleDeadlineCompleteAction(
  deadlineId: string
): Promise<ActionResponse<{ completed: boolean; completedIds: string[] }>> {
  if (!deadlineId || typeof deadlineId !== 'string') {
    return { success: false, message: 'ID deadline không hợp lệ' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Yêu cầu đăng nhập để thực hiện thao tác' };
  }

  if (!can(session.user.role, 'mark_complete')) {
    return { success: false, message: 'Bạn không có quyền đánh dấu deadline' };
  }

  const existingDeadline = await getDeadlineById(deadlineId);
  if (!existingDeadline) {
    return { success: false, message: 'Deadline không tồn tại' };
  }

  const result = await toggleDeadlineCompletion(session.user.id, deadlineId);

  revalidatePath('/dashboard');
  revalidatePath(`/deadlines/${deadlineId}`);

  return {
    success: true,
    data: result
  };
}

export async function createDeadlineAction(
  formData: FormData
): Promise<ActionResponse<Deadline>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Yêu cầu đăng nhập' };
  }

  if (!can(session.user.role, 'create')) {
    return { success: false, message: 'Chỉ lớp trưởng (admin) mới có quyền thêm deadline' };
  }

  const title = (formData.get('title') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const subjectSlug = (formData.get('subjectSlug') as string || '').trim();
  const dueDate = (formData.get('dueDate') as string || '').trim();
  const priorityRaw = (formData.get('priority') as string || '').trim();
  const type = (formData.get('type') as string || '').trim();

  if (!title || title.length < 3 || title.length > 200) {
    return { success: false, message: 'Tiêu đề deadline phải từ 3 đến 200 ký tự' };
  }

  if (!description || description.length < 5 || description.length > 1000) {
    return { success: false, message: 'Mô tả deadline phải từ 5 đến 1000 ký tự' };
  }

  const validSubjects = await getSubjects();
  const targetSubject = validSubjects.find((s) => s.slug === subjectSlug);
  if (!targetSubject) {
    return { success: false, message: 'Môn học đã chọn không hợp lệ' };
  }

  const timestamp = Date.parse(dueDate);
  if (isNaN(timestamp)) {
    return { success: false, message: 'Hạn nộp không đúng định dạng ngày giờ' };
  }

  const validPriorities = ['low', 'medium', 'high'] as const;
  const priority = validPriorities.includes(priorityRaw as 'low' | 'medium' | 'high')
    ? (priorityRaw as 'low' | 'medium' | 'high')
    : 'medium';

  if (!type || type.length < 2 || type.length > 50) {
    return { success: false, message: 'Loại bài tập phải từ 2 đến 50 ký tự' };
  }

  const newDeadline = await createDeadline({
    title,
    description,
    subjectSlug: targetSubject.slug,
    subjectCode: targetSubject.code,
    subjectName: targetSubject.name,
    dueDate,
    priority,
    type
  });

  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${newDeadline.id}`);
  revalidatePath('/');
  revalidatePath(`/subjects/${targetSubject.slug}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    data: newDeadline
  };
}

export async function deleteDeadlineAction(
  id: string
): Promise<ActionResponse<{ id: string }>> {
  if (!id || typeof id !== 'string') {
    return { success: false, message: 'ID không hợp lệ' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Yêu cầu đăng nhập' };
  }

  if (!can(session.user.role, 'delete')) {
    return { success: false, message: 'Chỉ lớp trưởng (admin) mới có quyền xoá deadline' };
  }

  const deadline = await getDeadlineById(id);
  if (!deadline) {
    return { success: false, message: 'Deadline không tồn tại' };
  }

  const success = await deleteDeadline(id);
  if (!success) {
    return { success: false, message: 'Không thể xoá deadline này' };
  }

  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${id}`);
  revalidatePath('/');
  revalidatePath(`/subjects/${deadline.subjectSlug}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    data: { id }
  };
}
