// @ts-nocheck
import type {PageProps} from "keycloakify/login/pages/PageProps";
import type {KcContext} from "../KcContext";
import type {I18n} from "../i18n";

import {Alert, Button, Checkbox, Form, Input} from 'antd';
import CommonService from "../CommonService";


export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
    } = props;

    const {
        url, messagesPerField, isAppInitiatedAction,message
    } = kcContext;

    const {msg, msgStr} = i18n;


    const onSubmit = async (values: { [key: string]: any }) => {
        CommonService.formSubmit(url.loginAction, values);
    }


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            displayMessage={true}
            headerNode={msg("updatePasswordTitle")}
        >
            <div className={"content-div"}>
                {
                    (message && (message.type !== "warning")) &&
                    <Alert message={message.summary} type={message.type} showIcon/>
                }
                <Form
                    name="basic"
                    labelCol={{span: 10}}
                    wrapperCol={{span: 14}}
                    initialValues={{"logout-sessions": true}}
                    onFinish={onSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        key={"password-new"}
                        label={msg("passwordNew")}
                        name={"password-new"}
                        rules={[{
                            required: true,
                            message: msgStr("error-user-attribute-required")
                        }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    {
                        messagesPerField.existsError("password") &&
                        <Alert key={"password-new"} message={messagesPerField.get("password")} type={"error"} showIcon/>
                    }

                    <Form.Item
                        key={"password-confirm"}
                        label={msg("passwordConfirm")}
                        name={"password-confirm"}
                        rules={[{
                            required: true,
                            message: msgStr("error-user-attribute-required")
                        }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    {
                        messagesPerField.existsError("password-confirm") &&
                        <Alert key={"password-confirm"} message={messagesPerField.get("password-confirm")}
                               type={"error"} showIcon/>
                    }
                    <Form.Item
                        key={"logout-sessions"}
                        name={"logout-sessions"} valuePropName="checked"
                    >
                        <Checkbox>
                            {msg("logoutOtherSessions")}
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {msg("doSubmit")}
                        </Button>
                    </Form.Item>
                </Form>
                {isAppInitiatedAction &&
                    <Form
                        name="cancelForm"
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                        initialValues={{"cancel-aia": true}}
                        onFinish={onSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            key={"cancel-aia"}
                            name={"cancel-aia"}
                            hidden={true}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                {msg("doCancel")}
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </div>
        </Template>
    );
}