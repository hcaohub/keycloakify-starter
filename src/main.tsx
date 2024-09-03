/* eslint-disable react-refresh/only-export-components */
// @ts-nocheck
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
            locale:{
              currentLanguageTag:'zh-CN'
            },
            message:{
                type:"error",
                summary:"skdfhskfh"
            },
            url:{
                loginAction:"http://www.baidu.com"
            },
            isAppInitiatedAction:true,
            profile:{
                "html5DataAnnotations": {
                    "kcMultivalued": ""
                },
                "context": "REGISTRATION",
                "formData": {
                    "phoneNumber": "15215203023",
                    "code": "851268",
                    "select-radiobuttons_item": "undefined",
                    "item_textarea": "undefined",
                    "name": "小七",
                    "favourite_pet": "dog",
                    "email": "xiaoqi@qq.com",
                    "multiselect_item": "dog",
                    "username": "15215203023"
                },
                "attributesByName": {
                    "username": {
                        "validators": {
                            "up-registration-email-as-username-username-value": {},
                            "username-prohibited-characters": {
                                "ignore.empty.value": true
                            },
                            "up-duplicate-username": {},
                            "up-username-mutation": {},
                            "multivalued": {
                                "max": "1"
                            },
                            "up-username-has-value": {},
                            "length": {
                                "max": 255,
                                "ignore.empty.value": true,
                                "min": 3
                            },
                            "up-registration-username-exists": {},
                            "up-username-not-idn-homograph": {
                                "ignore.empty.value": true
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${username}",
                        "values": [
                            "15215203023"
                        ],
                        "annotations": {},
                        "required": true,
                        "html5DataAnnotations": {},
                        "value": "15215203023",
                        "autocomplete": "username",
                        "multivalued": false,
                        "readOnly": false,
                        "name": "username"
                    },
                    "email": {
                        "validators": {
                            "up-blank-attribute-value": {
                                "error-message": "missingEmailMessage",
                                "fail-on-null": false
                            },
                            "multivalued": {
                                "max": "1"
                            },
                            "up-email-exists-as-username": {},
                            "length": {
                                "max": 255,
                                "ignore.empty.value": true
                            },
                            "up-immutable-attribute": {},
                            "up-duplicate-email": {},
                            "up-attribute-required-by-metadata-value": {},
                            "up-registration-email-as-username-email-value": {},
                            "email": {
                                "ignore.empty.value": true
                            }
                        },
                        "displayName": "${email}",
                        "values": [
                            "xiaoqi@qq.com"
                        ],
                        "annotations": {},
                        "required": true,
                        "html5DataAnnotations": {},
                        "value": "xiaoqi@qq.com",
                        "autocomplete": "email",
                        "multivalued": false,
                        "readOnly": false,
                        "name": "email"
                    },
                    "phoneNumber": {
                        "validators": {
                            "multivalued": {
                                "max": "1"
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${profile.attributes.phoneNumber}",
                        "values": [
                            "15215203023"
                        ],
                        "annotations": {},
                        "required": false,
                        "html5DataAnnotations": {},
                        "value": "15215203023",
                        "multivalued": false,
                        "readOnly": false,
                        "name": "phoneNumber"
                    },
                    "multiselect_item": {
                        "validators": {
                            "options": {
                                "options": [
                                    "dog",
                                    "cat"
                                ],
                                "ignore.empty.value": true
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${profile.attributes.multiselect_item}",
                        "values": [
                            "dog"
                        ],
                        "annotations": {
                            "inputType": "multiselect"
                        },
                        "required": false,
                        "html5DataAnnotations": {
                            "kcMultivalued": ""
                        },
                        "value": "dog",
                        "multivalued": true,
                        "readOnly": false,
                        "name": "multiselect_item"
                    },
                    "favourite_pet": {
                        "validators": {
                            "options": {
                                "options": [
                                    "dog",
                                    "cat"
                                ],
                                "ignore.empty.value": true
                            },
                            "up-immutable-attribute": {},
                            "up-attribute-required-by-metadata-value": {},
                            "multivalued": {
                                "max": "1"
                            }
                        },
                        "displayName": "${profile.attributes.favourite_pet}",
                        "values": [
                            "dog"
                        ],
                        "annotations": {
                            "inputHelperTextAfter": "after",
                            "inputType": "select",
                            "inputOptionLabelsI18nPrefix": "profile.attributes.favourite_pet",
                            "inputHelperTextBefore": "before",
                            "inputTypePlaceholder": "提示文案信息"
                        },
                        "required": true,
                        "html5DataAnnotations": {},
                        "value": "dog",
                        "group": {
                            "displayDescription": "${profile.attribute-group-description.test}",
                            "annotations": {
                                "akey": "avalue"
                            },
                            "displayHeader": "${profile.attribute-group.test}",
                            "html5DataAnnotations": {},
                            "name": "test"
                        },
                        "multivalued": false,
                        "readOnly": false,
                        "name": "favourite_pet"
                    },
                    "name": {
                        "validators": {
                            "up-attribute-required-by-metadata-value": {},
                            "multivalued": {
                                "max": "1"
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${profile.attributes.name}",
                        "values": [
                            "小七"
                        ],
                        "annotations": {},
                        "required": true,
                        "html5DataAnnotations": {},
                        "value": "小七",
                        "group": {
                            "displayDescription": "${profile.attribute-group-description.test}",
                            "annotations": {
                                "akey": "avalue"
                            },
                            "displayHeader": "${profile.attribute-group.test}",
                            "html5DataAnnotations": {},
                            "name": "test"
                        },
                        "multivalued": false,
                        "readOnly": false,
                        "name": "name"
                    },
                    "select-radiobuttons_item": {
                        "validators": {
                            "options": {
                                "options": [
                                    "dog",
                                    "cat"
                                ],
                                "ignore.empty.value": true
                            },
                            "multivalued": {
                                "max": "1"
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${profile.attributes.select-radiobuttons_item}",
                        "values": [
                            "undefined"
                        ],
                        "annotations": {
                            "inputType": "select-radiobuttons"
                        },
                        "required": false,
                        "html5DataAnnotations": {},
                        "value": "undefined",
                        "group": {
                            "displayDescription": "${profile.attribute-group-description.test}",
                            "annotations": {
                                "akey": "avalue"
                            },
                            "displayHeader": "${profile.attribute-group.test}",
                            "html5DataAnnotations": {},
                            "name": "test"
                        },
                        "multivalued": false,
                        "readOnly": false,
                        "name": "select-radiobuttons_item"
                    },
                    "item_textarea": {
                        "validators": {
                            "multivalued": {
                                "max": "1"
                            },
                            "up-immutable-attribute": {}
                        },
                        "displayName": "${profile.attributes.item_textarea}",
                        "values": [
                            "undefined"
                        ],
                        "annotations": {
                            "inputType": "textarea"
                        },
                        "required": false,
                        "html5DataAnnotations": {},
                        "value": "undefined",
                        "group": {
                            "displayDescription": "${profile.attribute-group-description.test}",
                            "annotations": {
                                "akey": "avalue"
                            },
                            "displayHeader": "${profile.attribute-group.test}",
                            "html5DataAnnotations": {},
                            "name": "test"
                        },
                        "multivalued": false,
                        "readOnly": false,
                        "name": "item_textarea"
                    }
                }
            },
            verifyPhone:true,
            supportPhone:true,
            termsAcceptanceRequired:true,
            recaptchaRequired:true,
            attemptedPhoneActivated:false,
            registrationPhoneNumberAsUsername:true,
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
