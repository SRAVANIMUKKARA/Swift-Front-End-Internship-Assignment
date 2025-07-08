import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Comment } from '../types';
import { fetchComments } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import SortButton from '../components/SortButton';
import Pagination from '../components/Pagination';

export default function DashboardPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Persistent state
  const [searchTerm, setSearchTerm] = useLocalStorage('dashboard-search', '');
  const [currentPage, setCurrentPage] = useLocalStorage('dashboard-page', 1);
  const [pageSize, setPageSize] = useLocalStorage('dashboard-pageSize', 10);
  const [sortColumn, setSortColumn] = useLocalStorage<'postId' | 'name' | 'email' | null>('dashboard-sortColumn', null);
  const [sortDirection, setSortDirection] = useLocalStorage<'asc' | 'desc' | null>('dashboard-sortDirection', null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchComments();
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  const filteredAndSortedComments = useMemo(() => {
    let filtered = comments;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = comments.filter(comment => 
        comment.name.toLowerCase().includes(term) ||
        comment.email.toLowerCase().includes(term) ||
        comment.postId.toString().includes(term)
      );
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortColumn) {
          case 'postId':
            aValue = a.postId;
            bValue = b.postId;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [comments, searchTerm, sortColumn, sortDirection]);

  const paginatedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedComments.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedComments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedComments.length / pageSize);

  const handleSort = (column: 'postId' | 'name' | 'email') => {
    if (sortColumn === column) {
      // Cycle through sort states
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const getSortState = (column: 'postId' | 'name' | 'email') => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? 'asc' : 'desc';
    }
    return 'none';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comments Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Showing {filteredAndSortedComments.length} of {comments.length} comments
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>View Profile</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name, email, or post ID..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">
                  <SortButton
                    column="Post ID"
                    currentSort={getSortState('postId')}
                    onClick={() => handleSort('postId')}
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  <SortButton
                    column="Name"
                    currentSort={getSortState('name')}
                    onClick={() => handleSort('name')}
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  <SortButton
                    column="Email"
                    currentSort={getSortState('email')}
                    onClick={() => handleSort('email')}
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-700">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-900">#{comment.postId}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{comment.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-blue-600 hover:text-blue-800 transition-colors">
                      {comment.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700 max-w-md">
                    <div className="truncate">{comment.body}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}