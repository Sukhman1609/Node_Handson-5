
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'
const socket = io('https://chat-x7zw.onrender.com/');

function App() {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    
    // const [broadcastMessage, setBroadcastMessage] = useState('');
    // const [exclusiveBroadcastMessage, setExclusiveBroadcastMessage] = useState('');
    // const [roomName, setRoomName] = useState(0);
    // const [roomMessages, setRoomMessages] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const getUserInput = () => {
            const user = prompt('Enter your name:');
            if (user) {
                setUsername(user);
                socket.emit('Msg', `User ${user} joined the chat.`);
            } else {
                alert('You must enter a name.');
                getUserInput();
            }
        };

        getUserInput();

       
        socket.on('Msg', (msg) => {
          const newMessage = { text: msg,user:'other'};
          setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // socket.on('JoinRoomSuccessfully', (msg) => {
        //     console.log(msg);
        // });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
      const newMessage = { text: `${username}: ${message}`, user: 'user' };
      
      // Check if the sender is the current user
      if (newMessage.user !== 'user') {
        setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      
      socket.emit('Msg', newMessage.text);
      setMessage('');
      // setRoomName(1);
    };

    // const handleJoinRoom = () => {
    //     socket.emit('JoinRoom', roomName);
    // };

    // const handleSendRoomMessage = () => {
    //     socket.emit('SendJoinRoomMsg', [roomName, `${username}: ${message}`]);
    //     setMessage('');
    // };

    return (
        <div>
          <h2>Chat Application</h2>
            <div className='chatme'>
              <img src='https://tse3.mm.bing.net/th?id=OIP.QS6R2MeeiAOTOvWYTkIrngAAAA&pid=Api&P=0&h=180' alt='nbdh'/>
                <h1>Welcome {username}!!</h1>
                {/* <ul>
                    {receivedMessages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul> */}<div style={{ overflowY: 'scroll', height: '460px' }}>
                {receivedMessages.map((msg, index) => {
                   if (msg.user === 'user') {
                    console.log('Rendering right:', msg.text);
                    return (
                      <div className='right' key={index} > <div className="right-message">
                        {msg.text}
                      </div></div>
                    );
                  } else if (msg.user === 'other') {
                    console.log('Rendering left:', msg.text);
                    return (
                      <div className='right' key={index}> <div  className="left-message">
                        {msg.text}
                      </div></div>
                    );
                  }
                  return null;
                })}
</div>
            <div className='inputf'>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
                </div>
            

            {/* <div>
                <h2>Broadcast Message from Server</h2>
                <p>{broadcastMessage}</p>
            </div>

            <div>
                <h2>Exclusive Broadcast Message from Server</h2>
                <p>{exclusiveBroadcastMessage}</p>
            </div> */}
           
        </div>
        </div>
    );
}

export default App;
