import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { pusher } from '../../services/pusherConfig';

const OnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    // useEffect(() => {
    //     // Initialize Pusher
    //     const pusher = new Pusher('f003ced16e0ef4d30160', {
    //         cluster: 'ap2',
    //         encrypted: true,
    //     });

    //     // Subscribe to the 'my-channel' channel
    //     const channel = pusher.subscribe('my-channel');

    //     // Bind to the 'onlineUser' event
    //     channel.bind('onlineUser', (data) => {
    //         // Update the list of online users when the event is received
    //         console.log("data ",data);
    //         setOnlineUsers(data.data);
    //     });

    //     // Cleanup: Unsubscribe from the channel when the component unmounts
    //     return () => {
    //         channel.unbind('onlineUser');
    //         pusher.unsubscribe('my-channel');
    //     };
    // }, []);


    useEffect(() => { 

        const channel = pusher.subscribe(`my-channel`);

        const handlePusherEvent = async (data) => {
            console.log("data ", data);
            setOnlineUsers(data.data);
        };

        channel.bind('onlineUser', handlePusherEvent);
        return () => {
            // Unsubscribe from the channel and remove event listener when the component unmounts

            pusher.unsubscribe('my-channel');
            channel.unbind('onlineUser', handlePusherEvent);
        };
    }, []);

    return (
        <div>
            <h2>Online Users</h2>
            <ul>
                {onlineUsers.map((userId) => (
                    <li key={userId}>{userId}</li>
                ))}
            </ul>
        </div>
    );
};

export default OnlineUsers