// @ts-nocheck
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";

import {Alert, Button, Form,} from 'antd';
import CommonService from "../CommonService";


export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        doMakeUserConfirmPassword,
        UserProfileFormFields
    } = props;

    const {
        url,message
    } = kcContext;

    const {msg} = i18n;


    const onRegister = async (values: { [key: string]: any }) => {
        console.log("@#@#@#------>",values)
        CommonService.formSubmit(url.registrationAction, values);
    }

    const [form] = Form.useForm();
    const callbackDefaultValue = (defaultValue) => {
        if (defaultValue) {
            form.setFieldsValue(defaultValue)
        }
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