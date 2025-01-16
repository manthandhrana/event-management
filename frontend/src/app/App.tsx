import React from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

const Home = () => {
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

export default Home;
