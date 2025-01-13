import { useState, useEffect } from "react";
import { Mail, Clock, User, MessageCircle, CheckCircle, Clock3 } from "lucide-react";
import contactService from "../../services/contactService";

const ContactAdminPanel = () => {
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, responded

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllMessages();
      setMessagesData(response.messages || []);
    } catch (err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setResponse(message.response || "");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendResponse = async () => {
    if (!response.trim()) {
      alert("Response cannot be empty!");
      return;
    }

    const messageData = {
      messageId: selectedMessage._id,
      name: selectedMessage.name,
      email: selectedMessage.email,
      message: response,
      status: 'responded',
      respondedAt: new Date().toISOString()
    };

    try {
      setSending(true);
      await contactService.sendMessage(messageData);
      
      // Update local state
      setMessagesData(prevMessages => 
        prevMessages.map(msg => 
          msg._id === selectedMessage._id 
            ? { ...msg, status: 'responded', response, respondedAt: new Date().toISOString() }
            : msg
        )
      );
      
      alert("Response sent successfully!");
      setSelectedMessage(prev => ({ ...prev, status: 'responded', response }));
    } catch (error) {
      alert("Failed to send response. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const filteredMessages = messagesData.filter(message => 
    activeTab === 'pending' ? !message.status || message.status === 'pending' : message.status === 'responded'
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Messages Admin Panel</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'pending' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Messages ({messagesData.filter(m => !m.status || m.status === 'pending').length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'responded' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('responded')}
        >
          Responded Messages ({messagesData.filter(m => m.status === 'responded').length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No {activeTab} messages</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors border ${
                  selectedMessage?._id === message._id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleMessageSelect(message)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{message.name}</span>
                  </div>
                  {message.status === 'responded' && (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Responded
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{message.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(message.createdAt)}</span>
                </div>

                <div className="text-sm line-clamp-2">{message.message}</div>
                
                {message.status === 'responded' && (
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="font-medium">Response sent: {formatDate(message.respondedAt)}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div>
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Message Details</h3>
                  {selectedMessage.status === 'responded' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Responded
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">From</label>
                    <div className="mt-1">{selectedMessage.name} ({selectedMessage.email})</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Received</label>
                    <div className="mt-1">{formatDate(selectedMessage.createdAt)}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Message</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">{selectedMessage.message}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Type your response here..."
                  disabled={selectedMessage.status === 'responded'}
                />
                {selectedMessage.status !== 'responded' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                        sending ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleSendResponse}
                      disabled={sending}
                    >
                      {sending ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                <p>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdminPanel;