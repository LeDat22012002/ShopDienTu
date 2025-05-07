import axios from '../axois';

export const apiCreateChatbox = (data) =>
    axios({
        url: '/chatbox/createChatbox',
        method: 'post',
        data,
    });
