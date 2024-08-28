// @ts-nocheck
import {useEffect, useState} from "react";
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";
import axios from "axios";

import {Alert, Button, Checkbox, Form, Input, List, Radio, Select,message as antMsg,} from 'antd';
import CommonService from "../CommonService";
import {useUserProfileForm} from "keycloakify/login/lib/useUserProfileForm";
import {ProFormCaptcha,} from '@ant-design/pro-components';
import {LockOutlined} from "@ant-design/icons";


export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const {kcContext, i18n, doUseDefaultCss, Template, classes, doMakeUserConfirmPassword} = props;

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        registrationDisabled,
        messagesPerField,
        supportPhone,
        message, isAppInitiatedAction,
        attemptedPhoneActivated,
        profile, verifyPhone
    } = kcContext;

    const {msg, msgStr, advancedMsg} = i18n;
    const {
        formState: {formFieldStates, isFormSubmittable},
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });


    const onGetCaptcha = async (phoneNumber: string) => {
        const params = {params: {phoneNumber}}
        let res = await axios.get(window.location.origin + '/realms/' + realm.name + '/sms/registration-code', params).catch((e)=>{
            console.log("###", e);
            antMsg.error(e?.response?.data?.error||e.message)
            return Promise.reject(new Error(e?.response?.data?.error||e.message));
        });
        if (res) {
            return;
        }
        // throw new Error(e.response.data.error)
    }
    const onRegister = async (values: { [key: string]: any }) => {
        console.log("#@#@##@", values)
        CommonService.formSubmit(url.registrationAction, values);
    }

    const [defaultField, setDefaultField] = useState([]);
    const [groupField, setGroupField] = useState({});
    const [group, setGroup] = useState({});
    const [defaultValue, setDefaultValue] = useState({});
    useEffect(() => {
        console.log("----->", formFieldStates)
        let _defaultField = [];
        let _groupField = {};
        let _group = {};
        let _defaultValue = {};
        formFieldStates?.map((field) => {
            let groupName = field?.attribute?.group?.name;
            if (!groupName) {
                _defaultField.push(field);
            } else {
                _group[groupName] = field?.attribute?.group;
                let groupFieldArr = _groupField[groupName] || [];
                groupFieldArr.push(field);
                _groupField[groupName] = groupFieldArr;
            }
            if (field?.valueOrValues) {
                if (field.valueOrValues instanceof Array) {
                    let arrayValues = [];
                    field.valueOrValues.map((item) => {
                        if (item && item.length > 0) {
                            arrayValues.push(item);
                        }
                    })
                    _defaultValue[field?.attribute?.name] = arrayValues;
                } else {
                    _defaultValue[field?.attribute?.name] = field.valueOrValues;
                }
            }
        })
        setDefaultField(_defaultField);
        setGroupField(_groupField);
        setGroup(_group);
        setDefaultValue(_defaultValue);
    }, []);

    const analysisField = (attribute, valueOrValues, displayableErrors) => {
        let inputType = attribute?.annotations?.inputType;
        let rules = [];
        let formItemAttr = {};
        if (attribute?.annotations?.inputHelperTextAfter) {
            formItemAttr.extra = advancedMsg(attribute?.annotations?.inputHelperTextAfter)
        }
        if (attribute.required) {
            rules.push({
                required: attribute.required,
                message: msgStr("error-user-attribute-required")
            })
        }
        if (inputType == "select" || inputType == "multiselect" || inputType == "select-radiobuttons" || inputType == "multiselect-checkboxes") {
            //
        } else {
            if (attribute?.validators?.length?.min > 0) {
                rules.push(
                    {
                        min: parseInt(attribute?.validators?.length?.min),
                        message: msgStr("error-invalid-length-too-short", attribute?.validators?.length?.min.toString())
                    });
            }
            if (attribute?.name==="phoneNumber") {
                rules.push(
                    {
                        pattern: /^1\d{10}$/,
                        message: msgStr("invalidPhoneNumber"),
                    },);
            }
            if (attribute?.validators?.length?.max > 0) {
                rules.push({
                    max: parseInt(attribute?.validators?.length?.max),
                    message: msgStr("error-invalid-length-too-long", attribute?.validators?.length?.max.toString())
                })
            }
            // if (attribute?.validators?.pattern?.pattern) {
            //     rules.push({
            //         pattern: attribute?.validators?.pattern?.pattern,
            //         message: msgStr("error-invalid-email")
            //     })
            // }
            if (attribute.name === "password-confirm") {
                rules.push(({getFieldValue}) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(msgStr("invalidPasswordConfirmMessage")));
                    },
                }));
            }
        }
        return <><Form.Item
            key={attribute.name}
            label={advancedMsg(attribute.displayName)}
            name={attribute.name}
            {...formItemAttr}
            hidden={attribute.name === "password-confirm" && !doMakeUserConfirmPassword}
            rules={rules}
        >
            {analysisAttr(attribute, valueOrValues)}
        </Form.Item>
            {
                displayableErrors?.map((error, index) => {
                    return <Alert key={index} message={error.errorMessageStr} type={"error"} showIcon/>
                })
            }
            {verifyPhone&&attribute.name === "phoneNumber" &&(
                <List.Item key={-2}>
                    {CommonService.captchaFormItem(msgStr,onGetCaptcha,true)}
                </List.Item>
            )}
        </>
            ;

    }
    const analysisAttr = (attribute, valueOrValues) => {
        let inputType = attribute?.annotations?.inputType;
        let placeholder = attribute?.annotations?.inputTypePlaceholder || "";
        let options = [];
        attribute?.validators?.options?.options?.map((item) => {
            let label = item;
            if (attribute?.annotations?.inputOptionLabels) {
                label = advancedMsg(attribute?.annotations?.inputOptionLabels[item] || item);
            }

            if (attribute?.annotations?.inputOptionLabelsI18nPrefix) {
                label = advancedMsg(attribute.annotations.inputOptionLabelsI18nPrefix + "." + item);
            }
            options.push({label: label, value: item})
        })
        if (inputType == "textarea") {
            return <Input.TextArea placeholder={placeholder}/>;
        }
        if (inputType == "select") {
            return <Select
                allowClear
                style={{width: '100%'}}
                placeholder={placeholder}
                options={options}
            />;
        }
        if (inputType == "multiselect") {
            return <Select
                mode="multiple"
                allowClear
                style={{width: '100%'}}
                placeholder={placeholder}
                options={options}
            />;
        }
        if (inputType == "select-radiobuttons") {
            return <Radio.Group options={options}></Radio.Group>
        }
        if (inputType == "multiselect-checkboxes") {
            return <Checkbox.Group options={options}/>;
        }

        // if (valueOrValues instanceof Array) {
        //     return (
        //         <>
        //             {valueOrValues.map((...[, i]) => (
        //                 <InputTag key={i} {...props} fieldIndex={i} />
        //             ))}
        //         </>
        //     );
        // }
        //
        // const inputNode = <InputTag {...props} fieldIndex={undefined} />;
        //
        if (attribute.name === "password" || attribute.name === "password-confirm") {
            return <Input.Password placeholder={placeholder}/>;
        }
        return <Input disabled={attribute.readOnly || false} placeholder={placeholder}/>
    }
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            // classes={classes}
            // displayMessage={!messagesPerField.existsError("username", "password","phoneNumber","code")}
            displayMessage={true}
        >
            <div style={{width: '50%'}}>
                <Form
                    name="basic"
                    labelCol={{span: 10}}
                    wrapperCol={{span: 14}}
                    initialValues={defaultValue}
                    onFinish={onRegister}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <List itemLayout="vertical">
                        <List.Item key={-1}>
                            {defaultField.map(({attribute, displayableErrors, valueOrValues}) => {
                                return analysisField(attribute, valueOrValues, displayableErrors);
                            })
                            }
                        </List.Item>
                        {
                            Object.keys(group).map((groupName, index) => {
                                let iGroup = group[groupName];
                                let iGroupField = groupField[groupName];
                                if (iGroup && iGroupField) {
                                    return (
                                        <List.Item key={index}>
                                            <List.Item.Meta
                                                title={advancedMsg(iGroup.displayHeader)}
                                                description={advancedMsg(iGroup.displayDescription)}
                                            />
                                            <>
                                                {iGroupField.map(({attribute, displayableErrors, valueOrValues}) => {
                                                    return analysisField(attribute, valueOrValues, displayableErrors);
                                                })
                                                }
                                            </>
                                        </List.Item>
                                    );
                                }
                            })
                        }

                    </List>


                    <Form.Item wrapperCol={{offset: 4, span: 16}}>
                        <Button type="primary" htmlType="submit" block>
                            {msg("doRegister")}
                        </Button>
                    </Form.Item>
                </Form>
                <div className={"bottom-span"}>
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>
                </div>
            </div>
        </Template>
    );
}