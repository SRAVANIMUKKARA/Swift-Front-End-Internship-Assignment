import { User, Comment } from '../types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const fetchComments = async (): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE}/comments`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};