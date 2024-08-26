// @ts-nocheck
import {useEffect, useState} from "react";
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";
import axios from "axios";

import {Alert, Button, Divider, Form, Space, Tabs, Tooltip} from 'antd';
import {createFromIconfontCN, LockOutlined, MobileOutlined, UserOutlined} from '@ant-design/icons';
import {LoginFormPage, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import CommonService, {providerIconParse} from "../CommonService";

const IconFont = createFromIconfontCN({
    scriptUrl: `${import.meta.env.BASE_URL}iconfont/iconfont.js`,
});

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const {kcContext, i18n, doUseDefaultCss, Template, classes} = props;

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        registrationDisabled,
        messagesPerField,
        supportPhone,
        message, isAppInitiatedAction,
        attemptedPhoneActivated,
    } = kcContext;

    const {msg, msgStr} = i18n;


    const [type, setType] = useState<string>(attemptedPhoneActivated ? 'mobile' : 'account');

    const onGetCaptcha = async (phoneNumber: string) => {
        const params = {params: {phoneNumber}}
        let res = await axios.get(window.location.origin + '/realms/' + realm.name + '/sms/authentication-code', params);
        console.log("###", res);
        if (res) {
            return;
        }
        // throw new Error(e.response.data.error)
    }
    const [form] = Form.useForm();
    const onLogin = async (values: { [key: string]: any }) => {
        if (values.phoneNumber) {
            values.phoneActivated = true;
        }
        CommonService.formSubmit(url.loginAction, values);
    }
    useEffect(() => {
        console.log("existsError username password phoneNumber code", messagesPerField.existsError("username", "password", "phoneNumber", "code"));
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            // displayMessage={!messagesPerField.existsError("username", "password","phoneNumber","code")}
            displayMessage={true}
        >

            <div style={{
                backgroundColor: 'white',
                height: '100vh',
            }}>
                {realm.password && (
                    <LoginFormPage
                        // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                        logo={`${import.meta.env.BASE_URL}images/logo.png`}
                        backgroundVideoUrl={`${import.meta.env.BASE_URL}video.mp4`}

                        form={form}
                        containerStyle={{
                            minWidth: 280,
                            maxWidth: '75vw',
                        }}
                        title={msg("loginAccountTitle")}
                        // subTitle={msg("loginAccountTitle")}
                        initialValues={{
                            rememberMe: !!login.rememberMe,
                            username: login.username ?? ""
                        }}
                        message={
                            (message !== undefined && (message.type !== "warning" || !isAppInitiatedAction))&&
                            <Alert message={message.summary} type={message.type} showIcon/>
                        }
                        actions={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                }}
                            >
                                <Divider plain>
                                  <span
                                      style={{
                                          fontWeight: 'normal',
                                          fontSize: 14,
                                      }}
                                  >
                                    {msg("identity-provider-login-label")}
                                  </span>
                                </Divider>
                                <Space align="center" size={24} key={1}>
                                    {social?.providers?.map((p, index) => (
                                        p.alias && providerIconParse[p.alias] ?
                                            <Tooltip title={p.displayName} key={index}>
                                                <Button id={`social-${p.alias}`} type="link"
                                                        icon={<IconFont type={`icon-${providerIconParse[p.alias]}`}
                                                                        style={{fontSize: '24px'}}/>}
                                                        onClick={() => {
                                                            window.location.href = p.loginUrl
                                                        }}>
                                                </Button>
                                            </Tooltip>
                                            :
                                            <Button id={`social-${p.alias}`} href={p.loginUrl} key={index}>
                                                {p.displayName}
                                            </Button>
                                    ))}
                                </Space>
                                {realm.password && realm.registrationAllowed && !registrationDisabled &&
                                    <div style={{
                                        fontSize: 14,
                                        marginTop: '20px',
                                    }}>
                                            {msg("noAccount")}{" "}
                                        <a tabIndex={8} href={url.registrationUrl}>{msg("doRegister")}</a>
                                        </div>
                                }
                            </div>
                        }
                        onFinish={onLogin}
                    >
                        {!usernameHidden && supportPhone &&
                            < Tabs
                                activeKey={type}
                                onChange={setType}
                                centered
                                items={[
                                    {
                                        key: 'account',
                                        label: msg("loginByPassword"),
                                    },
                                    {
                                        key: 'mobile',
                                        label: msg("loginByPhone"),
                                    },
                                ]}
                            />
                        }

                        {type === 'account' && (
                            <>
                                {!usernameHidden && (
                                    <ProFormText
                                        name="username"
                                        fieldProps={{
                                            size: 'large',
                                            prefix: <UserOutlined/>,
                                        }}
                                        placeholder={!realm.loginWithEmailAllowed
                                            ? msgStr("username")
                                            : !realm.registrationEmailAsUsername
                                                ? msgStr("usernameOrEmail")
                                                : msgStr("email")}
                                        rules={[
                                            {
                                                required: true,
                                                message: msgStr("missingUsernameMessage"),
                                            },
                                        ]}
                                    />
                                )}
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined/>,
                                    }}
                                    placeholder={msgStr("password")}
                                    rules={[
                                        {
                                            required: true,
                                            message: msgStr("missingPasswordMessage"),
                                        },
                                    ]}
                                />
                            </>
                        )}

                        {type === 'mobile' && (
                            <>
                                <ProFormText
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MobileOutlined/>,
                                    }}
                                    name="phoneNumber"
                                    placeholder={msgStr("phoneNumber")}
                                    rules={[
                                        {
                                            required: true,
                                            message: msgStr("requiredPhoneNumber"),
                                        },
                                        {
                                            pattern: /^1\d{10}$/,
                                            message: msgStr("invalidPhoneNumber"),
                                        },
                                    ]}
                                />
                                <ProFormCaptcha
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined/>,
                                    }}
                                    captchaProps={{
                                        size: 'large',
                                    }}
                                    placeholder={msgStr("verificationCode")}
                                    captchaTextRender={(timing, count) => {
                                        if (timing) {
                                            return `${count}`;
                                        }
                                        return msg("sendVerificationCode");
                                    }}
                                    phoneName={"phoneNumber"}
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message: msgStr("verificationCodeDoesNotMatch"),
                                        },
                                    ]}
                                    onGetCaptcha={onGetCaptcha}
                                />
                            </>
                        )}
                        <div style={{marginBottom: 24,}}>
                            {realm.rememberMe && !usernameHidden && (
                                <ProFormCheckbox noStyle name="rememberMe"> {msg("rememberMe")}</ProFormCheckbox>
                            )}
                            {realm.resetPasswordAllowed && (
                                <a style={{float: 'right',}}
                                   href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</a>
                            )}
                        </div>
                    </LoginFormPage>
                )}
            </div>
        </Template>
    );
}