'use strict';

var stylelint = {
    extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
    plugins: ["stylelint-order", "stylelint-prettier", "stylelint-scss"],
    ignoreFiles: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.json", "**/*.html"],
    rules: {
        // 禁止空块
        "block-no-empty": true,
        // 颜色6位长度
        "color-hex-length": "long",
        // 兼容自定义标签名
        "selector-type-no-unknown": [
            true,
            {
                ignoreTypes: [],
            },
        ],
        // 忽略伪类选择器 ::v-deep
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["v-deep"],
            },
        ],
        // 禁止低优先级的选择器出现在高优先级的选择器之后。
        "no-descending-specificity": null,
        // 不验证@未知的名字，为了兼容scss的函数
        "at-rule-no-unknown": null,
        // 禁止空注释
        "comment-no-empty": true,
        // 禁止简写属性的冗余值
        "shorthand-property-no-redundant-values": true,
        // 禁止值的浏览器引擎前缀
        "value-no-vendor-prefix": true,
        // property-no-vendor-prefix
        "property-no-vendor-prefix": true,
        "order/order": ["custom-properties", "declarations"],
        "order/properties-order": ["width", "height"],
    },
};

exports.stylelint = stylelint;
//# sourceMappingURL=index.development.js.map
