import { Dropdown } from 'antd-mobile'
import s from './index.module.less'
import c from 'classnames'

type ItemType = {
    key: string;
    title: string;
    multiple?: boolean;
    isAll?: boolean;
    children?: ItemType[];
}
export type DropdownSelectValue = Record<string, any>;
export type DropdownSelectProps = {
    className?: string;
    items: ItemType[];
    value?: DropdownSelectValue;
    onChange?: (value: DropdownSelectValue) => void;
}
export function DropdownSelect(props: DropdownSelectProps) {
    const { className, items, onChange } = props;
    let { value } = props;
    if (!value) value = {}

    return <div className={c(s.root, className)}>
        <Dropdown>
            {items.map(item => {
                const { key, title, children, multiple } = item;
                const values = value?.[key] || [];

                return (
                    <Dropdown.Item key={key} title={title}>
                        {children?.map(it => {
                            const { key: k, title, isAll } = it;
                            const active = multiple ? values?.includes(k) : values === k;
                            return (
                                <div
                                    className={c(s.item, active && s.active)}
                                    key={k}
                                    onClick={() => {
                                        if (multiple) {
                                            if (isAll) {
                                                value[key] = [k];
                                            } else if (values?.includes(k)) {
                                                value[key] = values.filter((it: string) => it !== k);
                                            } else {
                                                value[key] = [...values.filter((it: string) => !children.find(i => i.key === it && i.isAll)), k];
                                            }
                                        } else {
                                            value[key] = k;
                                        }
                                        console.log(value);
                                        onChange?.({ ...value });
                                    }}
                                >
                                    {title}
                                </div>
                            );
                        })}
                    </Dropdown.Item>
                )
            })}
        </Dropdown>
    </div>
}