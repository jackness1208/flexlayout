module.exports = {
    "env": {
        "browser": true,
        "jquery": true,
        "amd":true
    },
    "globals": {
        "__url": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "impliedStrict": true
        },
        "sourceType": "module",
    },
    /**
     *  "off" 或 0 - 关闭规则
     *  "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
     *  "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    "rules": {
        // 'strict': [2, "global"],
        // 禁止条件表达式中出现赋值操作符
        "no-cond-assign": 2,

        // 禁用 console
        "no-console": 0,

        // 禁止在正则表达式中使用控制字符 ：new RegExp("\x1f")
        "no-control-regex": 2,

        // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
        // always-multiline：多行模式必须带逗号，单行模式不能带逗号
        "comma-dangle": [2, "never"],

        // 禁止空语句块
        "no-empty": [1, { "allowEmptyCatch": true }],

        // 禁止不必要的布尔转换
        "no-extra-boolean-cast": 0,

        // 禁止 case 语句落空
        "no-fallthrough": "off",

        // 控制逗号前后的空格
        "comma-spacing": ['warn', { "before": false, "after": true }],

        // 空格控制
        "indent": [ "warn", 2 , {"SwitchCase": 1}],

        // 强制使用一致的换行风格
        "linebreak-style": [ "error" ],

        // 强制使用一致的反勾号、双引号或单引号
        "quotes": [ "warn", "single" ],

        // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
        "semi": [ "error", "always" ],

        // 关键字 后面必须跟空格
        "keyword-spacing": [1, {"before": true, "after": true}],

        // 要求或禁止语句块之前的空格
        "space-before-blocks": [1, "always"],
        // 要求或禁止块内填充
        "padded-blocks": [1, {"blocks": "never"}],

        // 一行代码最大长度
        "max-len": [1, {"code": 200, "ignoreStrings": true, "ignoreRegExpLiterals": true, "ignoreComments": true}],

        "no-trailing-spaces": [1, {"ignoreComments": true}],

        // 大括号风格要求
        "brace-style": [2],

        // 要求遵循大括号约定
        "curly": [2]

    }
};


