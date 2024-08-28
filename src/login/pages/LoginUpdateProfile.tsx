// @ts-nocheck
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";

import {Alert, Button, Form,} from 'antd';
import CommonService from "../CommonService";
import {useState} from "react";


export default function LoginUpdateProfile(props: PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n>) {
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        doMakeUserConfirmPassword,
        UserProfileFormFields
    } = props;

    const {
        url,isAppInitiatedAction,message
    } = kcContext;

    const {msg} = i18n;


    const [cancelAia, setCancelAia] = useState(false);
    const onRegister = async (values: { [key: string]: any }) => {
        if(cancelAia){
            values["cancel-aia"]=true;
        }
        setCancelAia(false);
        CommonService.formSubmit(url.loginAction, values);
    }

    const [form] = Form.useForm();
    const callbackDefaultValue = (defaultValue) => {
        if (defaultValue) {
            form.setFieldsValue(defaultValue)
        }
    } ;
    const doCancel = () => {
        setCancelAia(true);
        form.submit();
    }
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            displayMessage={true}
        >
            <div className={"content-div"}>
                {
                    (message && (message.type !== "warning")) &&
                    <Alert message={message.summary} type={message.type} showIcon/>
                }
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 10}}
                    wrapperCol={{span: 14}}
                    onFinish={onRegister}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <UserProfileFormFields kcContext={kcContext} i18n={i18n}
                                           doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                                           callbackDefaultValue={callbackDefaultValue}/>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {msg("doSubmit")}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        {isAppInitiatedAction&&

                        <Button type="primary" htmlType="button"  block onClick={doCancel}>
                            {msg("doCancel")}
                        </Button>
                        }
                    </Form.Item>
                </Form>
            </div>
        </Template>
    );
}