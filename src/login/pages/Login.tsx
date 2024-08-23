import {useEffect, useState} from "react";
import type {PageProps} from "keycloakify/login/pages/PageProps";
import {getKcClsx} from "keycloakify/login/lib/kcClsx";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";
import axios from "axios";

import {Button, Form, Tabs, Tooltip} from 'antd';
import {createFromIconfontCN, LockOutlined, MobileOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import './Login.css';
import CommonService,{providerIconParse} from "../CommonService";

const IconFont = createFromIconfontCN({
    scriptUrl: `${import.meta.env.BASE_URL}iconfont/iconfont.js`,
});

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const {kcContext, i18n, doUseDefaultCss, Template, classes} = props;

    const {kcClsx} = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        registrationDisabled,
        messagesPerField,
        supportPhone,
        attemptedPhoneActivated,
    } = kcContext;

    const {msg, msgStr} = i18n;


    const [type, setType] = useState<string>(attemptedPhoneActivated?'mobile':'account');

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
    const onLogin = async (values:{[key:string]:any}) => {
        if(values.phoneNumber){
            values.phoneActivated=true;
        }
        CommonService.formSubmit(url.loginAction,values);
    }
    useEffect(() => {
        console.log("existsError username password phoneNumber code",messagesPerField.existsError("username", "password","phoneNumber","code"));
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            // displayMessage={!messagesPerField.existsError("username", "password","phoneNumber","code")}
            displayMessage={true}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social.providers?.length && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr/>
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <div>
                                {social.providers.map((...[p, , providers]) => (
                                    providers && p.alias && providerIconParse[p.alias] ?
                                        <Tooltip title={p.displayName}>
                                            <Button id={`social-${p.alias}`} type="link"
                                                    icon={<IconFont type={`icon-${providerIconParse[p.alias]}`}
                                                                    style={{fontSize: '24px'}}/>}
                                                    onClick={()=>{window.location.href=p.loginUrl}}>
                                            </Button>
                                        </Tooltip>
                                        :
                                        <Button id={`social-${p.alias}`} href={p.loginUrl}>
                                            {p.displayName}
                                        </Button>
                                ))}
                            </div>
                            {/*<ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>*/}
                            {/*    {social.providers.map((...[p, , providers]) => (*/}
                            {/*        <li key={p.alias}>*/}
                            {/*            /!*<Button icon={<IconFont type={`icon-${p.alias}`} />}>{p.displayName}</Button>*!/*/}
                            {/*            <a*/}
                            {/*                id={`social-${p.alias}`}*/}
                            {/*                className={kcClsx(*/}
                            {/*                    "kcFormSocialAccountListButtonClass",*/}
                            {/*                    providers.length > 3 && "kcFormSocialAccountGridItem"*/}
                            {/*                )}*/}
                            {/*                type="button"*/}
                            {/*                href={p.loginUrl}*/}
                            {/*            >*/}
                            {/*                /!*{p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}*!/*/}
                            {/*                {p.alias && <IconFont type={`icon-${p.alias}`} />}*/}
                            {/*                <span*/}
                            {/*                    className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}*/}
                            {/*                    dangerouslySetInnerHTML={{ __html: p.displayName }}*/}
                            {/*                ></span>*/}
                            {/*            </a>*/}
                            {/*        </li>*/}
                            {/*    ))}*/}
                            {/*</ul>*/}
                        </div>
                    )}
                </>
            }
        >

            <div id="kc-form">
                {realm.password && (
                    <div>
                    <LoginForm
                        form={form}
                        contentStyle={{
                            // minWidth: 280,
                            // maxWidth: '75vw',
                        }}
                        // title="Ant Design"
                        // subTitle="title"
                        initialValues={{
                            rememberMe: !!login.rememberMe,
                            username: login.username ?? ""
                        }}
                        action={url.loginAction}
                        method="post"
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
                    </LoginForm>
                    </div>
                )}
            </div>
        </Template>
    );
}

// function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
//     const {kcClsx, i18n, passwordInputId, children} = props;
//
//     const {msgStr} = i18n;
//
//     const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);
//
//     useEffect(() => {
//         const passwordInputElement = document.getElementById(passwordInputId);
//
//         assert(passwordInputElement instanceof HTMLInputElement);
//
//         passwordInputElement.type = isPasswordRevealed ? "text" : "password";
//     }, [isPasswordRevealed]);
//
//     return (
//         <div className={kcClsx("kcInputGroup")}>
//             {children}
//             <button
//                 type="button"
//                 className={kcClsx("kcFormPasswordVisibilityButtonClass")}
//                 aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
//                 aria-controls={passwordInputId}
//                 onClick={toggleIsPasswordRevealed}
//             >
//                 <i className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")}
//                    aria-hidden/>
//             </button>
//         </div>
//     );
// }
