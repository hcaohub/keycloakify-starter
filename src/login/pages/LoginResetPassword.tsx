// @ts-nocheck
import {useEffect, useState} from "react";
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";

import {Alert, Button, Form, Tabs} from 'antd';
import {MobileOutlined, UserOutlined} from '@ant-design/icons';
import {ProFormText,} from '@ant-design/pro-components';
import CommonService from "../CommonService";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const {kcContext, i18n, doUseDefaultCss, Template, classes} = props;

    const {
        realm,
        url,
        supportPhone,
        message, isAppInitiatedAction,
        attemptedPhoneActivated,
    } = kcContext;

    const {msg, msgStr} = i18n;


    const [type, setType] = useState<string>(supportPhone && attemptedPhoneActivated ? 'mobile' : 'account');

    const onReset = async (values: { [key: string]: any }) => {
        if (values.phoneNumber) {
            values.phoneActivated = true;
        }
        CommonService.formSubmit(url.loginAction, values);
    }
    useEffect(() => {
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

            <div style={{width: '50%'}}>
                {
                    (message !== undefined && (message.type !== "warning" || !isAppInitiatedAction)) &&
                    <Alert message={message.summary} type={message.type} showIcon/>
                }
                <Form
                    name="basic"
                    labelCol={{span: 10}}
                    wrapperCol={{span: 14}}
                    onFinish={onReset}
                    autoComplete="off"
                >
                    {supportPhone &&
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
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined/>,
                                }}
                                label={!realm.loginWithEmailAllowed
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
                                label={msgStr("phoneNumber")}
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
                            {CommonService.captchaFormItem(msgStr,(phoneNumber)=>{return CommonService.sendVerificationCode(phoneNumber,window.location.origin + '/realms/' + realm.name + '/sms/reset-code')},true)}
                        </>
                    )}
                    <div>
                        {realm.resetPasswordAllowed && (
                            <a style={{float: 'right',marginBottom: 24}}
                               href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</a>
                        )}
                    </div>

                    <Form.Item wrapperCol={{offset: 4, span: 16}}>
                        <Button type="primary" htmlType="submit" block>
                            {msg("doSubmit")}
                        </Button>
                    </Form.Item>
                </Form>
                <div className={"bottom-span"}>
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>
                </div>

                <div>
                    {
                        <Alert
                            // message="Informational Notes"
                            description={(realm.duplicateEmailsAllowed?msgStr("emailInstructionUsername"):msgStr("emailInstruction"))+""+(supportPhone&&msgStr("phoneInstruction")||"")}
                            type="info"
                            showIcon
                        />
                    }
                </div>
            </div>
        </Template>
    );
}