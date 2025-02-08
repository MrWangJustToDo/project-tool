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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucHJvZHVjdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRWEsSUFBQSxTQUFTLEdBQVc7QUFDL0IsSUFBQSxPQUFPLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxnQ0FBZ0MsQ0FBQztBQUN4RSxJQUFBLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLGdCQUFnQixDQUFDO0FBQ3BFLElBQUEsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUM7QUFDckYsSUFBQSxLQUFLLEVBQUU7O0FBRUwsUUFBQSxnQkFBZ0IsRUFBRSxJQUFJOztBQUV0QixRQUFBLGtCQUFrQixFQUFFLE1BQU07O0FBRTFCLFFBQUEsMEJBQTBCLEVBQUU7WUFDMUIsSUFBSTtBQUNKLFlBQUE7QUFDRSxnQkFBQSxXQUFXLEVBQUUsRUFBRTtBQUNoQixhQUFBO0FBQ0YsU0FBQTs7QUFFRCxRQUFBLG9DQUFvQyxFQUFFO1lBQ3BDLElBQUk7QUFDSixZQUFBO2dCQUNFLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ2pDLGFBQUE7QUFDRixTQUFBOztBQUVELFFBQUEsMkJBQTJCLEVBQUUsSUFBSTs7QUFFakMsUUFBQSxvQkFBb0IsRUFBRSxJQUFJOztBQUUxQixRQUFBLGtCQUFrQixFQUFFLElBQUk7O0FBRXhCLFFBQUEsd0NBQXdDLEVBQUUsSUFBSTs7QUFFOUMsUUFBQSx3QkFBd0IsRUFBRSxJQUFJOztBQUU5QixRQUFBLDJCQUEyQixFQUFFLElBQUk7QUFFakMsUUFBQSxhQUFhLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLENBQUM7QUFDcEQsUUFBQSx3QkFBd0IsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7QUFDOUMsS0FBQTs7Ozs7In0=
