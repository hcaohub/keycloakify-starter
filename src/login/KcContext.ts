/* eslint-disable @typescript-eslint/ban-types */
import type { ExtendKcContext } from "keycloakify/login";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
};

export type KcContextExtensionPerPage = {
    "sms-otp.ftl": {
        // Your custom context here
        otpLogin: {
            userOtpCredentials: {
                id: string;
                userLabel: string;
            }[];
            selectedCredentialId?: string;
        };
    }
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
