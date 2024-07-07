import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import connection from './signalr';
import './index.css';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        connection.on("ReceiveMessage", (user, message) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
        });

        return () => {
            connection.off("ReceiveMessage");
        };
    }, []);

    const sendMessage = () => {
        connection.invoke("SendMessage", user, message).catch(err => console.error("Error sending message: ", err));
        setMessage('');
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Your name"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Your message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}><strong>{msg.user}:</strong> {msg.message}</li>
                ))}
            </ul>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));