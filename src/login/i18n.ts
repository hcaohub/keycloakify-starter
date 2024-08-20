import {createUseI18n} from "keycloakify/login";

export const {useI18n, ofTypeI18n} = createUseI18n({
    en: {
        loginByPassword:"By Password",
        loginByPhone:"By Phone",
        verificationCode:"Verification code",
        sendVerificationCode:"Verification code",
    },
    'zh-CN': {
        loginByPassword:"密码登录",
        loginByPhone:"手机号登录",
        verificationCode:"验证码",
        sendVerificationCode:"发送验证码",
    }
});

export type I18n = typeof ofTypeI18n;
