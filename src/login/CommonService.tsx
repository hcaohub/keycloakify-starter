export const providerIconParse: { [k: string]: string } = {
    github: "github",
    gitee: "gitee",
    wechat: "weixin",
    workwechat: "qiyeweixin"
}
export default {
    async formSubmit(url:string,values:{[key:string]:string}) {
        console.log("form submit", url,values)
        // 创建一个隐藏的表单并提交
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = url;
        hiddenForm.style.display = 'none';

        // 将表单数据添加到隐藏表单中
        Object.keys(values).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = values[key];
            hiddenForm.appendChild(input);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    },

}
