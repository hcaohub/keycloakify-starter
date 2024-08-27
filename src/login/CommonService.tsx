export const providerIconParse: { [k: string]: string } = {
    github: "github",
    gitee: "gitee",
    wechat: "weixin",
    workwechat: "qiyeweixin"
}


export const headerStyle= {
    // textAlign: 'center',
    // color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff',
    textAlign:'right'
};

export const contentStyle = {
    display: 'flex',
    justifyContent: 'center', /* 水平居中 */
    // minHeight: 120,
    // lineHeight: '120px',
    // color: '#fff',
    backgroundColor: '#fff',
};

export const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};

export const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#fff',
};

export const layoutStyle = {
    borderRadius: 8,
    // overflow: 'hidden',
    // width: 'calc(50% - 8px)',
    // maxWidth: 'calc(50% - 8px)',
};

export default {
    async formSubmit(url:string,values:{[key:string]:any}) {
        console.log("form submit", url,values)
        // 创建一个隐藏的表单并提交
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = url;
        hiddenForm.style.display = 'none';

        // 将表单数据添加到隐藏表单中
        Object.keys(values).forEach(key => {
            if(values[key] instanceof Array){
                values[key].map((val:any)=>{
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = val;
                    hiddenForm.appendChild(input);
                })
            }else{
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = values[key];
                hiddenForm.appendChild(input);
            }
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    },

}
