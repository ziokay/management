/**
 * 验证规则生成
 * @param {Object} page 某个 Vue 页面的 this
 * @param {String} newPassRef 某个 Vue 页面的 含有 newPass 值的组件 的 ref 名
 */
function validator (page, newPassRef) {
    const validePhone = (rule, value, callback) => {
        var re = /^1[0-9]{10}$/;
        if (value !== '' && !re.test(value)) {
            callback(new Error('请输入正确格式的手机号'));
        } else {
            callback();
        }
    };

    const valideRePass = (rule, value, callback) => {
        if (value !== page.$refs[newPassRef].value) {
            callback(new Error('两次输入密码不一致'));
        } else {
            callback();
        }
    };

    const validate = {
        id: [
            {
                required: true,
                message: '请输入账号',
                trigger: 'blur'
            },
            {
                min: 6,
                message: '请至少输入6个字符',
                trigger: 'blur'
            },
            {
                max: 16,
                message: '最多输入16个字符',
                trigger: 'blur'
            }
        ],
        staff_id: [
            {
                required: true,
                message: '请输入账号',
                trigger: 'blur'
            },
            {
                min: 6,
                message: '请至少输入6个字符',
                trigger: 'blur'
            },
            {
                max: 16,
                message: '最多输入16个字符',
                trigger: 'blur'
            }
        ],
        name: [
            {
                required: true,
                message: '请输入姓名',
                trigger: 'blur'
            },
            {
                min: 2,
                message: '请至少输入2个字符',
                trigger: 'blur'
            },
            {
                max: 20,
                message: '最多输入20个字符',
                trigger: 'blur'
            }
        ],
        // gender: [
        //     {
        //         required: true,
        //         type: 'number',
        //         message: '请选择性别',
        //         trigger: 'blur'
        //     }
        // ],
        card_id: [
            {
                required: true,
                message: '请输入身份证号码',
                trigger: 'blur'
            },
            {
                min: 18,
                message: '请输入18位身份证号码',
                trigger: 'blur'
            },
            {
                max: 18,
                message: '请输入18位身份证号码',
                trigger: 'blur'
            }
        ],
        phone: [
            {
                required: true,
                message: '请输入手机号码',
                trigger: 'blur'
            },
            {
                validator: validePhone
            }
        ],
        email: [
            {
                required: true,
                type: 'email',
                message: '请输入正确格式的邮箱',
                trigger: 'blur'
            }
        ],
        // 验证密码 password 简称 pass
        pass: [
            {
                required: true,
                message: '请输入原密码',
                trigger: 'blur'
            },
            {
                min: 6,
                message: '请至少输入6个字符',
                trigger: 'blur'
            },
            {
                max: 16,
                message: '最多输入16个字符',
                trigger: 'blur'
            }
        ],
        newPass: [
            {
                required: true,
                message: '请输入新密码',
                trigger: 'blur'
            },
            {
                min: 6,
                message: '请至少输入6个字符',
                trigger: 'blur'
            },
            {
                max: 16,
                message: '最多输入16个字符',
                trigger: 'blur'
            }
        ],
        rePass: [
            {
                required: true,
                message: '请再次输入新密码',
                trigger: 'blur'
            },
            {
                validator: valideRePass,
                trigger: 'blur'
            }
        ]
    };

    return {
        validePhone,
        valideRePass,
        validate
    };
}

export default validator;
