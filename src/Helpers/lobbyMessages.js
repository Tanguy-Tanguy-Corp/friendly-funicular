import { message } from 'antd';

const playerJoinMsg = (pseudo='Un joueur') => message.info({ content: `${pseudo} a rejoint la partie` });

const playerLeaveMsg = (pseudo='Un joueur') => message.info({ content: `${pseudo} a quitté la partie` });

const noPlaceMsg = () => message.warning({ content: "Il n'y a plus de places disponibles" });

const errorMsg = (err) => message.error({ content: err.response.data.errMsg });

export { playerJoinMsg, playerLeaveMsg, noPlaceMsg, errorMsg };