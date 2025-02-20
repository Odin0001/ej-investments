import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, DollarSign, Plus, Minus, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const usersList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (operation) => {
    if (!selectedUser || !amount || isNaN(Number(amount))) {
      setError('Please select a user and enter a valid amount');
      return;
    }

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const newBalance = operation === 'increase' 
        ? selectedUser.balance + Number(amount)
        : selectedUser.balance - Number(amount);

      if (newBalance < 0) {
        setError('Balance cannot be negative');
        return;
      }

      await updateDoc(userRef, {
        balance: newBalance
      });

      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, balance: newBalance }
          : user
      ));

      setSelectedUser({ ...selectedUser, balance: newBalance });
      setSuccess(`Successfully ${operation}d balance`);
      setAmount('');
      setError('');
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Failed to update balance');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return ( isAdmin &&
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="mr-2" /> Admin Panel
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <div className="flex flex-col space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Users List</h2>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email or username..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                      selectedUser?.id === user.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${user.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-gray-500">
                  No users found matching your search
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Balance Update Form */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Update Balance</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            {selectedUser ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Selected User:</p>
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-sm text-gray-500">Current Balance:</p>
                  <p className="font-medium">${selectedUser.balance.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUpdateBalance('increase')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Increase
                  </button>
                  <button
                    onClick={() => handleUpdateBalance('decrease')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Minus className="h-4 w-4 mr-1" /> Decrease
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a user to update their balance</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}