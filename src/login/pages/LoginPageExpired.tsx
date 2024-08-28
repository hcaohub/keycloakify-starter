import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import {Result} from "antd";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <Result
                status="403"
                title={msg("pageExpiredTitle")}
                extra={[
                    <div>
                        {msg("pageExpiredMsg1")}<a href={url.loginRestartFlowUrl}>{msg("doClickHere")}</a>
                    </div>,
                    <div>
                        {msg("pageExpiredMsg2")}<a href={url.loginAction}>{msg("doClickHere")}</a>
                    </div>,
                ]}
            />
        </Template>
    );
}
