import { useState, useEffect } from "react";
import { Mail, Clock, User, MessageCircle } from "lucide-react";
import contactService from "../../services/contactService";

const ContactAdminPanel = () => {
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false); // Track sending state

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllMessages();
      console.log("response", response);
      setMessagesData(response.messages || []);
    } catch (err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setResponse("");
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
      name: selectedMessage.name,
      email: selectedMessage.email,
      message: response,
    };
  
    try {
      console.log("Selected Message:", selectedMessage);
      console.log("Message Data to send:", messageData);
  
      setSending(true);
      const response = await contactService.sendMessage(messageData); // Call the service
      console.log("Server Response:", response);
  
      alert("Response sent successfully!");
      setResponse("");
    } catch (error) {
      console.error("Failed to send response:", error.response || error);
      alert(
        error.response?.data?.message || "Failed to send response. Please try again."
      );
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Messages Admin Panel</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {messagesData.map((message) => (
            <div
              key={message._id}
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors border ${
                selectedMessage?._id === message._id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
              onClick={() => handleMessageSelect(message)}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{message.name}</span>
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
            </div>
          ))}
        </div>

        {/* Message Detail View */}
        <div>
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Message Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      From
                    </label>
                    <div className="mt-1">
                      {selectedMessage.name} ({selectedMessage.email})
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Received
                    </label>
                    <div className="mt-1">
                      {formatDate(selectedMessage.createdAt)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Message
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Type your response here..."
                />
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
