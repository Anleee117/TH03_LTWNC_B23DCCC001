import fs from 'fs/promises';
import path from 'path';
import { Deadline, Subject, UserAccount } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');
const DEADLINES_FILE = path.join(DATA_DIR, 'deadlines.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const USER_COMPLETIONS_FILE = path.join(DATA_DIR, 'user-completions.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function getSubjects(): Promise<Subject[]> {
  return readJsonFile<Subject[]>(SUBJECTS_FILE);
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  const subject = subjects.find((s) => s.slug === slug);
  return subject || null;
}

export async function getDeadlines(): Promise<Deadline[]> {
  return readJsonFile<Deadline[]>(DEADLINES_FILE);
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  const deadline = deadlines.find((d) => d.id === id);
  return deadline || null;
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function getUsers(): Promise<UserAccount[]> {
  return readJsonFile<UserAccount[]>(USERS_FILE);
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function getUserCompletions(userId: string): Promise<string[]> {
  try {
    const data = await readJsonFile<Record<string, string[]>>(USER_COMPLETIONS_FILE);
    return data[userId] || [];
  } catch {
    return [];
  }
}

export async function toggleDeadlineCompletion(
  userId: string,
  deadlineId: string
): Promise<{ completed: boolean; completedIds: string[] }> {
  let data: Record<string, string[]> = {};
  try {
    data = await readJsonFile<Record<string, string[]>>(USER_COMPLETIONS_FILE);
  } catch {
    data = {};
  }

  const userList = new Set(data[userId] || []);
  let completed = false;

  if (userList.has(deadlineId)) {
    userList.delete(deadlineId);
    completed = false;
  } else {
    userList.add(deadlineId);
    completed = true;
  }

  const updatedIds = Array.from(userList);
  data[userId] = updatedIds;
  await writeJsonFile(USER_COMPLETIONS_FILE, data);

  return { completed, completedIds: updatedIds };
}

export async function createDeadline(
  payload: Omit<Deadline, 'id'>
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  const maxId = deadlines.reduce((max, d) => {
    const num = parseInt(d.id, 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  const newDeadline: Deadline = {
    id: String(maxId + 1),
    title: payload.title.trim(),
    description: payload.description.trim(),
    subjectSlug: payload.subjectSlug.trim(),
    subjectCode: payload.subjectCode.trim(),
    subjectName: payload.subjectName.trim(),
    dueDate: payload.dueDate,
    priority: payload.priority,
    type: payload.type.trim()
  };

  deadlines.push(newDeadline);
  await writeJsonFile(DEADLINES_FILE, deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const initialLength = deadlines.length;
  const filtered = deadlines.filter((d) => d.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await writeJsonFile(DEADLINES_FILE, filtered);

  try {
    const completions = await readJsonFile<Record<string, string[]>>(USER_COMPLETIONS_FILE);
    let changed = false;
    for (const userId of Object.keys(completions)) {
      if (completions[userId].includes(id)) {
        completions[userId] = completions[userId].filter((item) => item !== id);
        changed = true;
      }
    }
    if (changed) {
      await writeJsonFile(USER_COMPLETIONS_FILE, completions);
    }
  } catch {
  }

  return true;
}
