import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquare, Trash2, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/admin/contacts?limit=50');
      setContacts(data.data.contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/admin/contacts/${id}`);
      setContacts(contacts.filter(c => c._id !== id));
      alert('Message deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Contact Messages
          </h1>
          <p className="text-gray-600 mt-2">Total: {contacts.length} messages</p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No contact messages yet
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(contact.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Message ID: {contact._id}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
