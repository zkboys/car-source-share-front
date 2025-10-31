import { Dropdown } from 'antd-mobile'
import s from './index.module.less'
import c from 'classnames'

export type DropdownSelectItemType = {
  key: string;
  title: string;
  multiple?: boolean;
  labelAsTitle?: boolean;
  children?: DropdownSelectItemType[];
}
export type DropdownSelectValue = Record<string, string | string[]>;
export type DropdownSelectProps = {
  className?: string;
  items: DropdownSelectItemType[];
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
        const { key, title, children, multiple, labelAsTitle } = item;
        const values = value?.[key] || [];
        const label = children?.find(it => it.key === values)?.title

        return (
          <Dropdown.Item key={key} title={labelAsTitle ? label : title}>
            <div className={s.itemWrap}>
              {children?.map(it => {
                const { key: k, title } = it;
                const isAll = k === 'all';
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
                          // 删除
                          if (typeof values !== "string") {
                            value[key] = values.filter((it: string) => it !== k);
                          }
                        } else {
                          // 添加
                          if (typeof values !== "string") {
                            value[key] = [...values.filter((it: string) => it !== 'all'), k];
                          }
                        }
                        if (!value[key]?.length) value[key] = ['all'];
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
            </div>
          </Dropdown.Item>
        )
      })}
    </Dropdown>
  </div>
}
