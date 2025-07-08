import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building } from 'lucide-react';
import { User } from '../types';
import { fetchUsers } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await fetchUsers();
        if (users.length > 0) {
          setUser(users[0]);
        } else {
          setError('No users found');
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-blue-100">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a 
                      href={`https://${user.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {user.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Address
              </h2>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-gray-800">
                    {user.address.street}, {user.address.suite}
                  </p>
                  <p className="text-gray-800">
                    {user.address.city}, {user.address.zipcode}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">
                Company
              </h2>
              
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="text-gray-800 font-medium">{user.company.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{user.company.catchPhrase}</p>
                  <p className="text-gray-500 text-sm">{user.company.bs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}