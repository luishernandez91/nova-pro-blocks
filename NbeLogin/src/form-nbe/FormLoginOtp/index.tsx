import { Alert, Button } from 'antd';
import Form from 'antd/lib/form';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch, useIntl } from 'umi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { StateType } from '../model';
import { FormLoginTypeOTP } from './interfaces/formLoginOTP.interface';
import LoginForm from './components/user';
import styles from './index.less';
import FormItem from './components/FormItem';

const { Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  dataResponse: StateType['dataResponse'];
  status: StateType['status'];
}

/**
 * Const that shows message error
 * @param content message that shows inside input
 */
const LoginMessage: React.FC<{
  content: string;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ content, setIsError }) => (
  <Alert
    style={{
      marginTop: 16,
      marginBottom: 16,
    }}
    message={content}
    type="error"
    showIcon
    closable
    afterClose={() => {
      setIsError(false);
    }}
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { dataResponse, status } = props;
  const [type, setType] = useState<string>('account');
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const today = new Date();
  const currentHour = today.getHours();
  let messageGood: string;

  useEffect(() => {
    if (status !== 200 && status !== undefined) {
      setIsError(true);
    }
  }, [status]);

  const messageError: string = intl.formatMessage({
    id: 'login.messageError',
    defaultMessage: 'Introduce la información',
  });
  const messageErrorVerify: string = intl.formatMessage({
    id: 'login.messageErrorVerify',
    defaultMessage: 'Verifica la información',
  });
  const goodDay: string = intl.formatMessage({
    id: 'login.goodDay',
    defaultMessage: 'Buen día.',
  });
  const goodEvening: string = intl.formatMessage({
    id: 'login.goodEvening',
    defaultMessage: 'Buena tarde.',
  });
  const goodNight: string = intl.formatMessage({
    id: 'login.goodNight',
    defaultMessage: 'Buena noche.',
  });

  /**
   * Function that changes welcome message
   */
  if (currentHour >= 6 && currentHour < 12) {
    messageGood = goodDay;
  } else if (currentHour >= 12 && currentHour < 19) {
    messageGood = goodEvening;
  } else {
    messageGood = goodNight;
  }

  /**
   * Function that sends the request to login
   * @param values
   */
  const handleSubmit = (values: FormLoginTypeOTP) => {
    const { dispatch } = props;
    dispatch({
      type: 'authentication/loginOTP',
      payload: { ...values },
    });
    setIsPassword(true);
    form.resetFields();
  };

  /**
   *
   */
  const goBackHandler = async () => {
    const { dispatch } = props;
    dispatch({
      type: 'authentication/goBack',
    });
  };

  /**
   * Function that verify if input has at least 3 characters
   * @param event input event
   */
  const onChangeHandlerPassword = (event: any) => {
    setIsPassword(event.target.value.length < 3);
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit} from={form}>
        {!isError ? (
          <span className={styles.message}>
            {intl.formatMessage({
              id: 'login.messageWelcome',
              defaultMessage: '¡Bienvenido!',
            })}{' '}
            {messageGood}
          </span>
        ) : (
          <span className={styles.messageError}>
            <LoginMessage
              content={intl.formatMessage({
                id: 'login.signinError',
                defaultMessage: 'Servicio no disponible.',
              })}
              setIsError={setIsError}
            />
          </span>
        )}
        <FormItem
          prefix={<UserOutlined />}
          className={styles.obelisco}
          name="customer"
          maxLength={50}
          onPasteDisabled
          onCopyDisabled
          disabled
          defaultValue={dataResponse?.maskedBusinessName}
          placeholder={intl.formatMessage({
            id: 'login.customer',
            defaultMessage: 'Número de cliente',
          })}
          rules={[
            {
              required: true,
              message: messageError,
            },
            {
              min: 3,
              message: messageErrorVerify,
            },
          ]}
        />
        <FormItem
          prefix={<UserOutlined />}
          className={styles.obelisco}
          name="user"
          maxLength={50}
          onPasteDisabled
          onCopyDisabled
          disabled
          defaultValue={dataResponse?.maskedUserName}
          placeholder={intl.formatMessage({
            id: 'login.user',
            defaultMessage: 'Usuario',
          })}
          rules={[
            {
              required: true,
              message: messageError,
            },
            {
              min: 3,
              message: messageErrorVerify,
            },
          ]}
        />
        <FormItem
          prefix={<LockOutlined />}
          inputPassword
          className={styles.obelisco}
          name="OTP"
          maxLength={8}
          onPasteDisabled
          onCopyDisabled
          onChanged={(event) => onChangeHandlerPassword(event)}
          placeholder={intl.formatMessage({
            id: 'login.password',
            defaultMessage: 'Contraseña',
          })}
          rules={[
            {
              required: true,
              message: messageError,
            },
            {
              min: 3,
              message: messageErrorVerify,
            },
          ]}
        />
        <Submit disabled={isPassword}>
          {intl.formatMessage({
            id: 'login.signin',
            defaultMessage: 'Acceder',
          })}
        </Submit>
        <Button onClick={goBackHandler} className={styles.button}>
          {intl.formatMessage({
            id: 'login.itsnotme',
            defaultMessage: 'No soy yo',
          })}
        </Button>
      </LoginForm>
    </div>
  );
};

export default connect(({ authentication }: { authentication: StateType }) => ({
  dataResponse: authentication.dataResponse,
  status: authentication.status,
}))(Login);
