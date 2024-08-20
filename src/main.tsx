/* eslint-disable react-refresh/only-export-components */
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login.ftl",
        overrides: {
            url:{
                loginAction:"http://www.baidu.com"
            },
            supportPhone:true,
            "x-keycloakify": {messages: {

                    loginByPassword:"密码登录",
                    loginByPhone:"手机号登录",
                    verificationCode:"验证码",
                    sendVerificationCode:"发送验证码",
                }},
            social:{
                providers:[{
                    alias:'github',
                    loginUrl:'http://www.baidu.com',
                    displayName:"github"
                },{
                    alias:'gitee',
                    loginUrl:'http://www.baidu.com',
                    displayName:"gitee"
                },{
                    alias:'wechat',
                    loginUrl:'http://www.baidu.com',
                    displayName:"weixin"
                },{
                    alias:'workwechat',
                    loginUrl:'http://www.baidu.com',
                    displayName:"workweixin"
                }]
            }
        }
    });
}
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <h1>No Keycloak Context</h1>
        ) : (
            <KcPage kcContext={window.kcContext} />
        )}
    </StrictMode>
);
