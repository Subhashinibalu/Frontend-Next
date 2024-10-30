import { useState ,useEffect} from 'react';
import Layout from '../../components/Layout';
import protectedroute from '../../protectedroute';
import { MdAttachFile } from "react-icons/md";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import Form from '../../components/form';

const SOCKET_SERVER_URL = 'ws://localhost:3007'; 
export default function Chatpanel({ token }) {

const[message,setMessage]=useState('');
const [socket,setSocket]=useState(null); 
const[id,setId]=useState(null)
const [email,setEmail]=useState(null);
const [messages,setMessages]=useState([]);
const [to,setTo]=useState(null);

  useEffect(() => {
  
 
    const userId=sessionStorage.getItem("userId");
   setId(userId);
   const email=sessionStorage.getItem("email");
setEmail(email);
    

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    newSocket.on("join", (msg) => {
      console.log("Socket:", msg);
      
       
    });

    newSocket.on("message", (msg) => {
      console.log("Message from server:", msg);
      setTo(msg.from)
      setMessages(prevMessages => [...prevMessages, { text: msg.message, sender: msg.from,email:msg.email }]); 
      
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  const handleSubmit = (e) => {  
    e.preventDefault(); 
    if (message.trim()) {
        console.log("Sending message:", message);
        socket.emit('join', { id, who: "admin" ,from:email}); // Include session ID

        socket.emit('message', { message, id, who: "admin",from:email,to }); // Send message to user
        setMessages(prevMessages => [...prevMessages, { text: message, sender: 'admin' }]);    
        setMessage(''); 
        
    }
};


  return (
    <Layout>
      
      
      <div className="flex flex-col h-screen  justify-between"><h1 className='text-center text-3xl font-bold font-mono text-primary'>CHAT PANEL</h1>
        <div className="flex-grow  overflow-auto px-7">

        <div className="flex flex-col">
  {messages.map((msg, index) => (
    
    <div
      key={index}
      className={`p-2 rounded m-2 ${msg.sender === 'admin' ? 'text-white text-end bg-green-500 self-end' : 'text-start bg-blue-500 text-white self-start'}`}
      style={{ maxWidth: msg.sender === 'admin' ? '100%' : '80%', display: 'block' }}
    >{msg.email?<><span className='text-sm text-gray-200'>{msg.email}</span><br/> {msg.text}</>:<> {msg.text}</>}
     
    </div>
  ))}
</div>
              
        </div>
        <form onSubmit={handleSubmit} className="flex p-4 ">
          <div className="relative flex-grow -mt-14">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
