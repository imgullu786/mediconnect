import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, MessageCircle, Share2, Users, X, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { mockAppointments } from '../../data/mockData';

const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppointment = () => {
      setLoading(true);
      setTimeout(() => {
        const found = mockAppointments.find(app => app.id === appointmentId);
        if (found) {
          setAppointment(found);
        }
        setLoading(false);
      }, 500);
    };
    
    fetchAppointment();
  }, [appointmentId]);
  
  useEffect(() => {
    // Simulated video setup
    const setupVideo = async () => {
      try {
        if (!localVideoRef.current) return;
        
        // Request access to camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Simulate remote video after delay
        setTimeout(() => {
          if (remoteVideoRef.current) {
            // In a real app, this would be the remote peer's stream
            // Here we're just simulating it with a static image
            remoteVideoRef.current.poster = "https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg";
            
            toast.success("Doctor connected to the call");
          }
        }, 3000);
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error("Failed to access camera or microphone");
      }
    };
    
    if (appointment && !loading) {
      setupVideo();
    }
    
    // Cleanup
    return () => {
      // Stop all tracks when component unmounts
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [appointment, loading]);
  
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // In a real app, this would enable/disable the audio track
    toast.success(isMicOn ? "Microphone muted" : "Microphone unmuted");
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In a real app, this would enable/disable the video track
    toast.success(isVideoOn ? "Camera turned off" : "Camera turned on");
  };
  
  const endCall = () => {
    // In a real app, this would disconnect the call
    toast.success("Call ended");
    navigate('/appointments');
  };
  
  const shareScreen = () => {
    // In a real app, this would implement screen sharing
    toast.success("Screen sharing started");
  };
  
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        const doctorMessage = {
          sender: 'Dr. Smith',
          text: 'Thank you for sharing that information. I\'ll make a note of it.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prevMessages => [...prevMessages, doctorMessage]);
      }, 2000);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4 text-white">
        <h2 className="text-2xl font-bold mb-4">Appointment Not Found</h2>
        <p className="text-gray-300 mb-8">The appointment you're looking for doesn't exist or has been cancelled.</p>
        <button 
          onClick={() => navigate('/appointments')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Appointments
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-white font-medium">Video Consultation</h1>
            <p className="text-gray-400 text-sm">Connected with Dr. John Smith</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-red-500 flex items-center mr-3">
            <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
            <span className="text-sm">25:13</span>
          </span>
          <button 
            onClick={() => navigate('/appointments')}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Video area */}
        <div className="flex-1 relative">
          {/* Remote video (doctor) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-black"
          ></video>
          
          {/* Local video (patient) */}
          <div className="absolute bottom-4 right-4 w-40 h-30 md:w-64 md:h-48 border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover bg-gray-800 ${
                isVideoOn ? '' : 'hidden'
              }`}
            ></video>
            
            {!isVideoOn && (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-500">
                  <Users size={30} />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat sidebar - only visible when open */}
        {isChatOpen && (
          <div className="w-full md:w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white font-medium">Chat</h2>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {msg.sender} • {msg.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start the conversation with the doctor</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 text-white border-none rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white rounded-r-lg px-4 hover:bg-blue-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center">
        <div className="flex space-x-4">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full ${
              isMicOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isVideoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
          </button>
          
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 text-white"
          >
            <Phone size={24} />
          </button>
          
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-3 rounded-full ${
              isChatOpen ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
            }`}
          >
            <MessageCircle size={24} />
          </button>
          
          <button
            onClick={shareScreen}
            className="p-3 rounded-full bg-gray-700 text-white"
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;