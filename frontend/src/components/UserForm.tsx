"use client";
import React, { useState } from 'react';
import { createUser, getUsers } from '../services/userService';
import "../app/globals.css";

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', age: '', hobbies: [] as string[] });

  // Handle input change for username and age
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.username || !formData.age) {
        alert('All fields are required');
        return;
      }

      const userData = {
        username: formData.username,
        age: parseInt(formData.age, 10),
        hobbies: formData.hobbies,
      };

      await createUser(userData);
      setFormData({ username: '', age: '', hobbies: [] });

      // Show success message and refresh page
      alert('User created successfully!');
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit}>
        <h1>User Data</h1>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default UserForm;
