export interface InitFlexlayoutOption {
    /** 是否进行 meta 缩放处理,默认为 true */
    scale?: boolean;
    /** 是否进行竖屏的rem 单独适配,默认为 true */
    vrem?: boolean;
}
export declare function initFlexlayout(op?: InitFlexlayoutOption): void;
