import { message } from "antd"

const infoUpdateMsg = (pseudo='Un joueur') => {
  message.info({ content: `${pseudo} a rejoint la partie`, key: 'socket' })
}

const gameUpdateMsg = (pseudo='Un joueur') => {
  message.info({ content: `${pseudo} a quitté la partie`, key: 'socket' })
}

const playerUpdateMsg = () => {
  message.warning({ content: "Il n'y a plus de places disponibles", key: 'socket' })
}

export { infoUpdateMsg, gameUpdateMsg, playerUpdateMsg }