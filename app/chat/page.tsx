import React from 'react'

const ChatBot = () => {
    return (
        <div>
            This is your ChatBot
            <br />
            Ask anything related to NMCI
            <br /><br /><hr />
            <div className='flex items-center bottom-0 border-t p-4'>
                <input type="text" placeholder="Type your message here..." />
                <button>Send</button>
            </div>
        </div>
    )
}

export default ChatBot
