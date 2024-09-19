import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        }
    };

    const handleSave = async (userId, updatedUser) => {
        try {
            await axios.put(`http://localhost:8000/api/users/${userId}/`, updatedUser, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            fetchUsers(); // Перезагружаем пользователей после сохранения
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            fetchUsers(); // Перезагружаем пользователей после удаления
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    return (
        <div className={styles.adminPage}>
            <h1>Manage Users</h1>
            {error && <p className={styles.error}>{error}</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <EditableUserRow
                            key={user.id}
                            user={user}
                            onSave={handleSave}
                            onDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EditableUserRow = ({ user, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = () => {
        onSave(user.id, editedUser);
        setIsEditing(false);
    };

    const toggleBlockUser = () => {
        const updatedUser = { ...editedUser, is_blocked: !editedUser.is_blocked };
        onSave(user.id, updatedUser);
    };

    return (
        <tr>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleInputChange}
                    />
                ) : (
                    user.username
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    user.email
                )}
            </td>
            <td>{user.is_blocked ? 'Blocked' : 'Active'}</td>
            <td>
                {isEditing ? (
                    <button className={styles.saveBtn} onClick={handleSave}>Save</button>
                ) : (
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button className={styles.deleteBtn} onClick={() => onDelete(user.id)}>Delete</button>
                <button className={styles.blockBtn} onClick={toggleBlockUser}>
                    {user.is_blocked ? 'Unblock' : 'Block'}
                </button>
            </td>
        </tr>
    );
};

export default AdminPage;
