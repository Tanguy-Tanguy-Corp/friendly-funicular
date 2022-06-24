import { message } from "antd"

const submitMove = () => {
  message.loading({ content: 'Vérification du coup', key: 'validation' })
}

const validMove = () => {
  message.success({ content: 'Coup validé', key: 'validation' })
}

const illegalMove = () => {
  message.error({ content: 'Coup illégal', key: 'validation' })
}

const yourTurn = () => {
  message.info('A vous de jouer!')
}

const notYourTurn = () => {
  message.error("Ce n'est pas votre tour!!!")
}

const lockedTile = () => {
  message.warning("Tuile verrouillée!")
}

const noChanges = () => {
  message.warning("Rien à changer (et rien ne changera jamais!)")
}

export { submitMove, validMove, illegalMove, yourTurn, notYourTurn, lockedTile, noChanges }