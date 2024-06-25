import { createUseI18n } from "keycloakify/login";

export const { useI18n, ofTypeI18n } = createUseI18n({
    en: {
        otpSmsLogin: "One-Time Password (SMS)",
    },
    fr: {
        otpSmsLogin: "Mot de passe à usage unique (SMS)",
    }
});

export type I18n = typeof ofTypeI18n;
