// @ts-nocheck
import {lazy, Suspense, useMemo} from "react";
import type {ClassKey} from "keycloakify/login";
import type {KcContext} from "./KcContext";
import {useI18n} from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";

const UserProfileFormFields = lazy(
    () => import("./UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });
    const classes = useCustomStyles(kcContext);
    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl": return (
                        <Login
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                        />
                    );
                    case "register.ftl": return (
                        <Register
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    case "login-reset-password.ftl": return (
                        <LoginResetPassword
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                        />
                    );
                    case "login-update-profile.ftl": return (
                        <LoginUpdateProfile
                            {...{ kcContext, i18n, classes }}
                            Template={Template}
                            doUseDefaultCss={false}
                            UserProfileFormFields={UserProfileFormFields}
                            doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        />
                    );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

function useCustomStyles(kcContext: KcContext) {
    return useMemo(() => {

        // You stylesheet that applies to all pages.
        import("./main.css");
        let classes: { [key in ClassKey]?: string } = {
            // Your classes that applies to all pages
        };
        // switch (kcContext.pageId) {
        //     case "login.ftl":
        //         // You login page specific stylesheet.
        //         import("./pages/login.css");
        //         classes = {
        //             ...classes,
        //             // Your classes that applies only to the login page
        //         };
        //         break;
        //     case "register.ftl":
        //         // Your account page specific stylesheet
        //         import("./pages/register.css");
        //         classes = {
        //             ...classes,
        //             // Your classes that applies only to the register page
        //         };
        //         break;
        //     // ...
        // }

        return classes;

    }, []);
}
