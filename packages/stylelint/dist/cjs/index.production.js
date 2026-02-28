'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.stylelint = void 0;
exports.stylelint = {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucHJvZHVjdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFYSxPQUFBLENBQUEsU0FBUyxHQUFXO0FBQy9CLElBQUEsT0FBTyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsZ0NBQWdDLENBQUM7QUFDeEUsSUFBQSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQztBQUNwRSxJQUFBLFdBQVcsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0FBQ3JGLElBQUEsS0FBSyxFQUFFOztBQUVMLFFBQUEsZ0JBQWdCLEVBQUUsSUFBSTs7QUFFdEIsUUFBQSxrQkFBa0IsRUFBRSxNQUFNOztBQUUxQixRQUFBLDBCQUEwQixFQUFFO1lBQzFCLElBQUk7QUFDSixZQUFBO0FBQ0UsZ0JBQUEsV0FBVyxFQUFFLEVBQUU7QUFDaEIsYUFBQTtBQUNGLFNBQUE7O0FBRUQsUUFBQSxvQ0FBb0MsRUFBRTtZQUNwQyxJQUFJO0FBQ0osWUFBQTtnQkFDRSxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztBQUNqQyxhQUFBO0FBQ0YsU0FBQTs7QUFFRCxRQUFBLDJCQUEyQixFQUFFLElBQUk7O0FBRWpDLFFBQUEsb0JBQW9CLEVBQUUsSUFBSTs7QUFFMUIsUUFBQSxrQkFBa0IsRUFBRSxJQUFJOztBQUV4QixRQUFBLHdDQUF3QyxFQUFFLElBQUk7O0FBRTlDLFFBQUEsd0JBQXdCLEVBQUUsSUFBSTs7QUFFOUIsUUFBQSwyQkFBMkIsRUFBRSxJQUFJO0FBRWpDLFFBQUEsYUFBYSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDO0FBQ3BELFFBQUEsd0JBQXdCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0FBQzlDLEtBQUE7Q0FDRjs7In0=
