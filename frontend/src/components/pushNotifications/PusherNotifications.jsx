import React from 'react'
import { Avatar } from '@mantine/core'; 


export const PusherNotifications = (data, role) => {

    const notifi_message = notificationMessage(data);
    let notificationUrl = data?.message_type === "video_meeting" || data?.message_type === "audio_meeting" ? data?.message_type === "appointment_request" ? `${role.toLowercase()}/appointment` : `/dashboard/video-meeting/${data.meeting_id}` : `/chat/${data.sender_id}`;

    let notifyShow = {
        withCloseButton: true,
        title: (
            <span onClick={() => window.open(notificationUrl, "_blank")}>
                {data?.sender_name}
            </span>
        ),
        message: (
            <span onClick={() => window.open(notificationUrl, "_blank")}>
                {notifi_message}
            </span>
        ),
        color: "#d07d23",
        autoClose: 4000,
        icon: (
            <Avatar
                src={`${data?.sender_image}`}
                alt="user-profile-image"
                radius={"xl"}
                onClick={() => window.open(notificationUrl, "_blank")}
            />
        ),
        loading: false,
    };

    return notifyShow;
}

const notificationMessage = (data) => {
    let notifi_message = '';
    if (data?.attach_type === "image") {
        notifi_message = "sent an image document";
    } else if (data?.attach_type === "video") {

        notifi_message = "sent a video clip";
    } else if (data?.attach_type === "document") {

        notifi_message = "sent a document file";
    } else if (data?.message_type === "video_meeting") {

        notifi_message = "initiated a video meeting";
    } else if (data?.message_type === "audio_meeting") {
        notifi_message = "initiated an audio meeting";
    }
    else {
        notifi_message = data?.message;
    }

    return notifi_message;
}