import React, { useCallback, useState } from 'react';
import { Button, Switch, Form, Input, Radio, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
//import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './Create.css';

const { Title, Link } = Typography;

//const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 4 }},wrapperCol: { xs: { span: 24 }, sm: { span: 20 }}};
//const formItemLayoutWithOutLabel = {wrapperCol: {xs: {span: 24, offset: 4}, sm: {span: 24, offset: 4}}};

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
const databaseName = process.env.NODE_ENV === 'development' ? 'Development' : 'Production'

const Create = () => {
  let navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['gameid']);

  const subToBackEnd = useCallback(async (gameID, gamename, nbPlayers, isPrivate, password) => {
    
    await fetch(
      `${backendURL}/games/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ database: databaseName, Document:{ gameID, gamename, nbPlayers, isPrivate, password }})
      }
    )
  }, [])

  const onFinish = async (values) => {
    console.log('Success:', values);
    const gameID =  uuidv4()
    await subToBackEnd(gameID, values.name, values.nbPlayers, values.isPrivate, values.password)
    setCookie('gameid', gameID, { path: '/' });
    navigate('/lobby')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [isPrivate, setIsPrivate] = useState(false)

  const onPrivateChange = (checked) => {
    setIsPrivate(checked)
  }

  return (
    <div>
      <Title>Créer une nouvelle partie</Title>
      {cookies.gameid && <Link href={'/game'} strong type='warning'>{`Attention vous êtes déja dans une partie en cours (game ID: ${cookies.gameid})`}</Link>}
        <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item label="Nom de la partie" name="name" rules={ [{ required: true, message: 'Merci de fournir un nom de partie!' }] }>
            <Input />
          </Form.Item>
          <Form.Item label="Nombre de joueurs" name="nbPlayers" rules={[{ required: true, message: 'Merci de fournir un nombre de joueurs'}]}>
            <Radio.Group>
              <Radio.Button value="2">2</Radio.Button>
              <Radio.Button value="3">3</Radio.Button>
              <Radio.Button value="4">4</Radio.Button>
          </Radio.Group>
          </Form.Item>
          {/*<Form.List name="players" rules={[{ validator: async (_, names) => {if (!names || names.length < 2) { return Promise.reject(new Error('2 Joueurs minimum'))}}}]}>
            {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? 'Joueurs' : ''} required={false} key={field.key}>
                  <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} rules={[{ required: true, whitespace: true, message: "Merci de fournir le pseudo du joueur"}]} noStyle>
                    <Input placeholder="Pseudo" style={{ width: '60%' }}/>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)}/>
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                  Ajouter joueur
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
            )}
          </Form.List>*/}
          <Form.Item label='Private' name="isPrivate" valuePropName="checked" wrapperCol={{ offset: 0, span: 16 }}>
            <Switch disabled onChange={onPrivateChange}/>
          </Form.Item>
          {isPrivate && <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input a game password!' }]}>
            <Input.Password/>
          </Form.Item>}
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Créer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;