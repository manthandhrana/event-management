"use client"
import React from "react";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";

const App = () => {
  return (
    <div>
      <nav>
      <h1>User Management System</h1>
      </nav>
      <UserForm />
      <UserList />
    </div>
  );
};

export default App;
