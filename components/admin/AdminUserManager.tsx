import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface User {
  id: string;
  email: string;
  subscription: string;
  isAdmin?: boolean;
  scanCount?: number;
}

export default function AdminUserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json();
      if (data.user) {
        await fetchUsers();
      } else {
        setError('Action failed');
      }
    } catch {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Subscription</th>
              <th className="text-left p-2">Admin</th>
              <th className="text-left p-2">Scans</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.subscription}</td>
                <td className="p-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                <td className="p-2">{user.scanCount ?? '-'}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, 'promote')} disabled={user.isAdmin}>Promote</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, 'demote')} disabled={!user.isAdmin}>Demote</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, 'limitScans')}>Limit Scans</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, 'upgrade')}>Upgrade</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
