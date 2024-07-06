import { Suspense, lazy, useMemo } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    useGlobalCss(kcContext);

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
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

const classes = {} satisfies { [key in ClassKey]?: string };

function useGlobalCss(kcContext: KcContext) {

    useMemo(() => {
        switch (kcContext.themeName) {
            case "my-app-1":
                import("./main-1.css");
                switch(kcContext.pageId){
                    case "register.ftl":
                        import("./pages/register-1.css");
                        break;
                }
                break;
            case "my-app-2":
                import("./main-2.css");
                switch(kcContext.pageId){
                    case "register.ftl":
                        import("./pages/register-2.css");
                        break;
                }
                break;
        }
    }, []);
}
