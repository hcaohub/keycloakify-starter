// @ts-nocheck
import {useEffect, useState} from "react";
import {assert} from "keycloakify/tools/assert";
import type {TemplateProps} from "keycloakify/login/TemplateProps";
import {getKcClsx} from "keycloakify/login/lib/kcClsx";
import {useInsertScriptTags} from "keycloakify/tools/useInsertScriptTags";
import {useInsertLinkTags} from "keycloakify/tools/useInsertLinkTags";
import {useSetClassName} from "keycloakify/tools/useSetClassName";
import type {I18n} from "./i18n";
import type {KcContext} from "./KcContext";
import {ConfigProvider, Layout, Select} from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import {contentStyle, footerStyle, headerStyle, layoutStyle} from "./CommonService";

const { Header, Footer, Sider, Content } = Layout;
export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const [antdLocale, setAntdLocal] = useState(enUS);

    const { msg, msgStr, getChangeLocaleUrl, labelBySupportedLanguageTag, currentLanguageTag } = i18n;

    const { realm, locale, auth, url, message, isAppInitiatedAction, authenticationSession, scripts } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const [languageSelect, setLanguageSelect] = useState([]);

    useEffect(() => {
        const { currentLanguageTag } = locale ?? {};

        locale.supported.map((item)=>{
            languageSelect.push({ label: labelBySupportedLanguageTag[item.languageTag], value: item.languageTag})
        })
        setLanguageSelect(languageSelect);

        if (currentLanguageTag === undefined) {
            return;
        }
        switch (currentLanguageTag) {
            case "zh-CN":{
                setAntdLocal(zhCN);
                break;
            }
        }
        const html = document.querySelector("html");
        assert(html !== null);
        html.lang = currentLanguageTag;
    }, []);

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                  `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                  `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
                  `${url.resourcesPath}/css/login.css`
              ]
    });

    const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: "Template",
        scriptTags: [
            {
                type: "module",
                src: `${url.resourcesPath}/js/menu-button-links.js`
            },
            ...(authenticationSession === undefined
                ? []
                : [
                      {
                          type: "module",
                          textContent: [
                              `import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";`,
                              ``,
                              `checkCookiesAndSetTimer(`,
                              `  "${authenticationSession.authSessionId}",`,
                              `  "${authenticationSession.tabId}",`,
                              `  "${url.ssoLoginInOtherTabsUrl}"`,
                              `);`
                          ].join("\n")
                      } as const
                  ]),
            ...scripts.map(
                script =>
                    ({
                        type: "text/javascript",
                        src: script
                    }) as const
            )
        ]
    });

    useEffect(() => {
        console.log("---->",kcContext);
        if (areAllStyleSheetsLoaded) {
            insertScriptTags();
        }
    }, [areAllStyleSheetsLoaded]);

    if (!areAllStyleSheetsLoaded) {
        return null;
    }

    return (
            <ConfigProvider locale={antdLocale} theme={{
                token: {
                    // Seed Token，影响范围大
                    colorPrimary: '#f65405',
                },
            }}>
            {/*<div id="kc-header" className={kcClsx("kcHeaderClass")}>*/}
            {/*    <div id="kc-header-wrapper" className={kcClsx("kcHeaderWrapperClass")}>*/}
            {/*        /!*{msg("loginTitleHtml", realm.displayNameHtml)}*!/*/}
            {/*        <img src={`${import.meta.env.BASE_URL}images/logo.png`} width={100}/>*/}
            {/*    </div>*/}
            {/*</div>*/}

                    <Layout className={"layoutStyle"}>
                        <Header className={"headerStyle"}>
                            {realm.internationalizationEnabled && (assert(locale !== undefined), locale.supported.length > 1) && (
                                <Select
                                    variant="borderless"
                                    defaultValue={currentLanguageTag}
                                    onChange={(value)=>{
                                        window.location.href=getChangeLocaleUrl(value);
                                    }}
                                    className={"languageSelect"}
                                    options={languageSelect}
                                />
                            )}
                        </Header>
                        <Content className={"contentStyle"}>
                            {children}
                        </Content>
                        <Footer className={"footerStyle"}></Footer>
                    </Layout>

            </ConfigProvider>
    );
}
