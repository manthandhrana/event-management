"use client";
import React, { useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
} from 'react-flow-renderer';
import { getUsers, deleteUser, updateUser } from '../services/userService';
import "../app/globals.css";

const hobbiesList = ['Reading', 'Writing', 'Speaking', 'Learning', 'Coding','Dancing','Fishing','Team Sports','Walking','Yoga','Traveling','Golf'];

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ username: '', age: '', hobbies: '' });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        setUsers(data);

        const generatedNodes: Node[] = [];
        const generatedEdges: Edge[] = [];
        
        data.forEach((user: any, index: number) => {
          const userHobbies = Array.isArray(user.hobbies)
            ? user.hobbies
            : user.hobbies?.split(',') || [];

          const userNode: Node = {
            id: user._id,
            data: { label: `${user.username} (${user.age})\nHobbies: ${userHobbies.join(', ')}` },
            position: { x: index * 200, y: 50 },
            type: 'default',
          };
          generatedNodes.push(userNode);

          userHobbies.forEach((hobby: string, hobbyIndex: number) => {
            const hobbyNodeId = `${user._id}-hobby-${hobby}-${hobbyIndex}`;
            const hobbyNode: Node = {
              id: hobbyNodeId,
              data: { label: hobby },
              position: { x: index * 200, y: 150 + hobbyIndex * 50 },
              type: 'output',
            };
            generatedNodes.push(hobbyNode);

            const edge: Edge = {
              id: `e-${user._id}-${hobbyNodeId}`,
              source: user._id,
              target: hobbyNodeId,
            };
            generatedEdges.push(edge);
          });
        });

        setNodes(generatedNodes);
        setEdges(generatedEdges);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      if (editUserId) {
        await updateUser(editUserId, {
          username: editData.username,
          age: parseInt(editData.age, 10),
          hobbies: editData.hobbies,
        });

        setUsers(
          users.map((user) =>
            user._id === editUserId ? { ...user, ...editData, age: parseInt(editData.age, 10) } : user
          )
        );
        setEditUserId(null);
        alert("User updated successfully");
        window.location.reload();
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      setNodes(nodes.filter((node) => !node.id.startsWith(userId)));
      setEdges(edges.filter((edge) => edge.source !== userId && edge.target !== userId));
      alert("User deleted successfully");
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (user: any) => {
    setEditUserId(user._id);
    setEditData({ username: user.username, age: user.age, hobbies: user.hobbies });
  };

 const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();

  const hobby = event.dataTransfer.getData('hobby');
  const targetNodeId = (event.target as HTMLElement)?.getAttribute('data-id');

  if (hobby && targetNodeId) {
    try {
      const user = users.find((user) => user._id === targetNodeId);

      if (!user) {
        alert('No valid user node found');
        return;
      }

      const hobbiesArray = Array.isArray(user.hobbies)
        ? user.hobbies
        : user.hobbies.split(',');

      if (hobbiesArray.includes(hobby)) {
        alert(`Hobby "${hobby}" already exists for ${user.username}`);
        window.location.reload();
        return;
      }

      const updatedHobbies = [...hobbiesArray, hobby];
      await updateUser(user._id, { hobbies: updatedHobbies });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, hobbies: updatedHobbies } : u
        )
      );

      window.location.reload();
      alert(`Hobby "${hobby}" added to ${user.username}`);

      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === user._id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: `${user.username} (${user.age})\nHobbies: ${updatedHobbies.join(', ')}`,
              },
            };
          }
          return node;
        });

        const uniqueHobbyNodeId = `${user._id}-hobby-${hobby}-${Date.now()}`;
        updatedNodes.push({
          id: uniqueHobbyNodeId,
          data: { label: hobby },
          position: { x: 200, y: 200 },
          type: 'output',
        });

        setEdges((prevEdges) => [
          ...prevEdges,
          { id: `e-${user._id}-${uniqueHobbyNodeId}`, source: user._id, target: uniqueHobbyNodeId },
        ]);

        return updatedNodes;
      });
    } catch (error) {
      alert('Error updating user hobbies');
    }
  }
};

          const uniqueHobbyNodeId = `${user._id}-hobby-${hobby}-${Date.now()}`;
          updatedNodes.push({
            id: uniqueHobbyNodeId,
            data: { label: hobby },
            position: { x: 200, y: 200 },
            type: 'output',
          });

          setEdges((prevEdges) => [
            ...prevEdges,
            { id: `e-${user._id}-${uniqueHobbyNodeId}`, source: user._id, target: uniqueHobbyNodeId },
          ]);

          return updatedNodes;
        });
      } catch (error) {
        alert('Error updating user hobbies');
      }
    }
  };

  return (
    <ReactFlowProvider>
      <div>
        <h1>User List</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editUserId === user._id ? (
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editUserId === user._id ? (
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleChange}
                    />
                  ) : (
                    user.age
                  )}
                </td>
                <td>
                  {editUserId === user._id ? (
                    <>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={() => setEditUserId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="hobbies-list">
          <h2>Available Hobbies</h2>
          <input
            type="text"
            placeholder="Search hobbies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="hobby-items">
            {hobbiesList.filter(hobby => hobby.toLowerCase().includes(searchQuery.toLowerCase())).map((hobby) => (
              <div
                key={hobby}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('hobby', hobby)}
                className="draggable-hobby"
              >
                {hobby}
              </div>
            ))}
          </div>
        </div>

        <h1>Users Visualization</h1>
        <div
          style={{ height: '500px',margin:'10px', border: '1px solid black' }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <ReactFlow nodes={nodes} edges={edges} />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default UserList;
