import { message } from "antd"

const submitMoveMsg = () => {
  message.loading({ content: 'Vérification du coup', key: 'validation' })
}

const validMoveMsg = () => {
  message.success({ content: 'Coup validé', key: 'validation' })
}

const illegalMoveMsg = () => {
  message.error({ content: 'Coup illégal', key: 'validation' })
}

const yourTurnMsg = () => {
  message.info({ content: 'A vous de jouer!' })
}

const notYourTurnMsg = () => {
  message.error({ content: "Ce n'est pas votre tour!!!" })
}

const unexpectedErrorMsg = (err) => {
  message.error({ content: `Une erreur s'est produite: ${err.message}, plus de détails dans la console` });
  console.log(err);
}

const lockedTileMsg = () => {
  message.warning({ content: "Tuile verrouillée!" })
}

const noChangesMsg = () => {
  message.warning({ content: "Rien à changer (et rien ne changera jamais!)" })
}



export { submitMoveMsg, validMoveMsg, illegalMoveMsg, yourTurnMsg, notYourTurnMsg, lockedTileMsg, noChangesMsg, unexpectedErrorMsg }