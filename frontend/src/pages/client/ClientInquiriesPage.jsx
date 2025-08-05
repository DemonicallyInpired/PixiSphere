import { useQuery } from '@tanstack/react-query';
import { clientApi } from '../../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientInquiriesPage = () => {
  const { data: inquiries = [], isLoading, isError } = useQuery({
    queryKey: ['client-inquiries'],
    queryFn: clientApi.getInquiries
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6">Failed to load inquiries.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Inquiries</h1>
      <div className="mb-6">
        <Link to="/client/submit-inquiry" className="btn-primary">Submit New Inquiry</Link>
      </div>
      {inquiries.length === 0 ? (
        <div className="text-gray-500">No inquiries found.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inquiry => (
            <Link
              key={inquiry.id}
              to={`/client/inquiries/${inquiry.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:bg-gray-50 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{inquiry.category}</div>
                  <div className="text-gray-600 text-sm">{inquiry.city} • {new Date(inquiry.eventDate).toLocaleDateString()}</div>
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Status: {inquiry.status}
                </div>
              </div>
              <div className="text-gray-700 mt-2">{inquiry.description?.slice(0, 100)}...</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientInquiriesPage;
