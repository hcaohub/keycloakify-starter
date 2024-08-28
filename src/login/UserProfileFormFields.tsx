// @ts-nocheck
import {useEffect, useState} from "react";

import {Alert, Checkbox, Form, Input, List, Radio, Select,} from 'antd';
import CommonService from "./CommonService";
import {useUserProfileForm} from "keycloakify/login/lib/useUserProfileForm";


export default function UserProfileFormFields(props) {
    const {kcContext, i18n, doMakeUserConfirmPassword, callbackDefaultValue} = props;

    const {
        realm,
        verifyPhone
    } = kcContext;

    const {msgStr, advancedMsg} = i18n;
    const {
        formState: {formFieldStates, isFormSubmittable},
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });


    const [defaultField, setDefaultField] = useState([]);
    const [groupField, setGroupField] = useState({});
    const [group, setGroup] = useState({});
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
        callbackDefaultValue && callbackDefaultValue(_defaultValue);
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
            if (attribute?.name === "phoneNumber") {
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
        return <div key={"DVI" + attribute.name}>
            <Form.Item
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
            {verifyPhone && attribute.name === "phoneNumber" && (
                CommonService.captchaFormItem(msgStr, (phoneNumber) => {
                    return CommonService.sendVerificationCode(phoneNumber, window.location.origin + '/realms/' + realm.name + '/sms/registration-code')
                }, true)
            )}
        </div>;

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
    );
}
