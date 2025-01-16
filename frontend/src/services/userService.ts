require('dotenv').config()

const API_URL = process.env.API_BACKEND_URL || "http://localhost:5000/api/users" // Updated
console.log("Backend URL:", API_URL);
// console.log("Backend URL:", backendurl);

export const getUsers = async () => {
  const response = await fetch(`${API_URL}`);
  return response.json();
};

export const createUser = async (user: { username: string; age: number;hobbies:string[] }) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user), // Ensure this matches backend expectations
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
};

export const updateUser = async (userId: string, updatedData: any) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return response.json();
};

export const deleteUser = async (userId: string) => {
  await fetch(`${API_URL}/${userId}`, { 
    method: 'DELETE',
     headers: { 'Content-Type': 'application/json' }, 
    });
};
