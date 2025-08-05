import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientInquiryDetailsPage = () => {
  const { id } = useParams();
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['client-inquiries'],
    queryFn: clientApi.getInquiries
  });
  const inquiry = inquiries.find(i => String(i.id) === String(id));

  if (isLoading) return <LoadingSpinner />;
  if (!inquiry) return <div className="p-6">Inquiry not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/client/inquiries" className="text-blue-600 hover:underline">&larr; Back to all inquiries</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">{inquiry.category} Inquiry</h1>
      <div className="mb-2 text-gray-500">{new Date(inquiry.eventDate).toLocaleDateString()} • {inquiry.city}</div>
      <div className="mb-4">Status: <span className="font-semibold">{inquiry.status}</span></div>
      <div className="mb-4">
        <div className="font-semibold">Description:</div>
        <div>{inquiry.description}</div>
      </div>
      {inquiry.referenceImageUrl && (
        <div className="mb-4">
          <div className="font-semibold">Reference Image:</div>
          <img src={inquiry.referenceImageUrl} alt="Reference" className="max-w-xs rounded border" />
        </div>
      )}
      <div className="mb-4">
        <div className="font-semibold">Budget:</div>
        <div>₹{inquiry.budget}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Responses:</div>
        <div>{inquiry.responseCount || 0}</div>
      </div>
      {/* Add more details or actions here as needed */}
    </div>
  );
};

export default ClientInquiryDetailsPage;
