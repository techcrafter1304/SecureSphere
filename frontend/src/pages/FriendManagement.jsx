import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const FriendManagement = () => {
  const [contacts, setContacts] = useState('');
  const [foundFriends, setFoundFriends] = useState(null); // null instead of []
  const [error, setError] = useState('');

  const handleFindFriends = async () => {
    const contactsArray = contacts.split(',').map(email => email.trim()).filter(e => e);
    try {
      const res = await axiosClient.post('/users/find-friends', { contacts: contactsArray });
      setFoundFriends(res.data); // should be [] if none
      setError('');
    } catch (err) {
      setFoundFriends([]);
      setError(err.response?.data?.msg || 'Error finding friends');
    }
  };

  const handleAddFriend = async (friendId) => {
    console.log("Adding friend with ID:", friendId);

    try {
      await axiosClient.post('/users/add-friend', { friendId });
      alert('Friend added!');
    } catch (err) {
    console.log('Response error:', err.response);
      alert(err.response?.data?.msg || 'Error adding friend');
    }
  };

  return (
    <div>
      <h2>Find and Add Friends</h2>
      <textarea
        rows="4"
        placeholder="Enter emails separated by commas"
        value={contacts}
        onChange={e => setContacts(e.target.value)}
      />
      <br />
      <button onClick={handleFindFriends}>Find Friends</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {foundFriends && foundFriends.length > 0 && (
        <div>
          <h3>Found Friends:</h3>
          <ul>
            {foundFriends.map(friend => (
              <li key={friend._id}>
                {friend.name} ({friend.email}){' '}
                <button onClick={() => handleAddFriend(friend._id)}>Add Friend</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {foundFriends && foundFriends.length === 0 && (
        <p>No friends found for those emails.</p>
      )}
    </div>
  );
};

export default FriendManagement;
