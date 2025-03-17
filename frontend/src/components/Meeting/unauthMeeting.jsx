import React from 'react'
import unAuthImg from '../../assets/images/meeting/icon/unauthorized.png'
const UnAuthMeeting = () => {
    return (
        <div className='meeting-unauth'>
            <img src={unAuthImg} />
            <h2>Access Denied </h2>
            <p>You have no access in this meeting</p>
        </div>
    )
}

export default UnAuthMeeting