import { useState ,useEffect} from 'react';
import Layout from '../../components/Layout';
import protectedroute from '../../protectedroute';
import { MdAttachFile } from "react-icons/md";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = 'ws://localhost:3007'; 
export default function Chatpanel({ token }) {
  // State to hold user and admin messages
  const [userMessages, setUserMessages] = useState(["Hello from user!"]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
const [socket,setSocket]=useState(null); 

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("message", (msg) => {
      console.log("Message from server:", msg);
      
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  const handleSubmit = (e) => {  
    console.log("Sending message:", inputValue);
    socket.emit('message', { inputValue}); 
  
    e.preventDefault();
    if (inputValue.trim()) {
      setAdminMessages([...adminMessages, inputValue]);
      setInputValue(''); // Clear input
    }
  };

  return (
    <Layout>
      
      
      <div className="flex flex-col h-screen  justify-between"><h1 className='text-center text-3xl font-bold font-mono text-primary'>CHAT PANEL</h1>
        <div className="flex-grow  overflow-auto px-7">
          {/* Display user messages */}
          {userMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg float-left">
                {msg}
              </div>
              <div className="clear-both" />
            </div>
          ))}
          {/* Display admin messages */}
          {adminMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <div className="bg-green-500 text-white p-2 rounded-lg float-right">
                {msg}
              </div>
              <div className="clear-both" />
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex p-4 ">
          <div className="relative flex-grow -mt-14">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg pl-10 w-full" // Added padding to the left for icon
              placeholder="Type your message..."
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdAttachFile />
            </span>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-5 h-fit py-2 rounded-lg ml-2 -mt-14">
            Send
          </button>
        </form>
      </div>
    


    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  return protectedroute(req);
}
