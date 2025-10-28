import React, { useEffect, useState } from 'react';

type EnumParamsValue = readonly [string | number, string | number | React.ReactNode, ...unknown[]];

// 参数
type Params = {
  [key: string | number]: EnumParamsValue;
};

// 获取枚举值 { key: value}
type EnumKeyValue<T extends Params> = {
  [K in keyof T]: T[K][0];
};

// 获取枚举标签 { value: label}
type EnumLabelValue<T extends Params> = {
  [P in T[keyof T][0]]: Extract<T[keyof T], readonly [P, any]>[1];
};

// 选项格式
type Option<V, L> = {
  value: V;
  label: L;
  color?: any;
  tag?: any;
  [x: string]: any;
};

// 精确化选项
type ExtractOption<T extends Params> = {
  [K in keyof T]: Option<T[K][0], T[K][1]>;
};

// 转换为选项格式的类型  { value: { label,value,....others} }
type EnumValueOption<T extends Params> = {
  [V in T[keyof T][0]]: Option<V, Extract<T[keyof T], readonly [V, any]>[1]>;
};

// Options格式
type Options<T extends Params> = ExtractOption<T>[keyof T][];

type EnumProps<T extends Params> = {
  options: Options<T>;
  omit: (values?: EnumKeyValue<T>[keyof T] | EnumKeyValue<T>[keyof T][]) => Options<T>;
  pick: (values?: EnumKeyValue<T>[keyof T] | EnumKeyValue<T>[keyof T][]) => Options<T>;
  prependAll: (allItem?: EnumParamsValue) => [Option<EnumParamsValue[0], EnumParamsValue[1]>, ...Options<T>];
  getLabel: <V extends EnumKeyValue<T>[keyof T] | undefined>(value: V,) => V extends EnumKeyValue<T>[keyof T] ? EnumLabelValue<T>[V] : undefined;
  getText: <V extends EnumKeyValue<T>[keyof T] | undefined>(value: V,) => V extends EnumKeyValue<T>[keyof T] ? EnumLabelValue<T>[V] : undefined;
  getColor: <V extends EnumKeyValue<T>[keyof T]>(value: V, defaultColor?: string) => string | undefined;
  getTag: (value: any, defaultColor?: string) => any;
  getItem: <V extends keyof EnumValueOption<T> | undefined>(
    value: V,
  ) => V extends keyof EnumValueOption<T> ? EnumValueOption<T>[V] : undefined;
};

type EnumOutput<T extends Params> = EnumKeyValue<T> & EnumProps<T>;

type AsyncEnumProps = {
  load: (...args: any) => Promise<EnumOutput<any>>;
  useLoad: (...args: any) => EnumOutput<any>;
} & EnumProps<any>;

// 对外暴露识别枚举
export type PickEnumValues<T> = {
  [K in keyof T]: T[K] extends string | number ? T[K] : never;
}[keyof T];

let __allItem: EnumParamsValue = ['', '全部'];

export function setEnumAllItem(allItem: EnumParamsValue) {
  __allItem = allItem;
}

let _tagRender: <T extends Params>(item?: T) => JSX.Element | null;

export function setEnumTagRender<T extends Params>(tagRender: (item?: ExtractOption<T>) => JSX.Element | null) {
  _tagRender = tagRender as any;
}

function setEnumFunction<T extends Params>(_enum: EnumOutput<T>) {
  // 获取Item方法
  (_enum as any).getItem = (value: string | number | undefined) => {
    const item = _enum.options?.find((item) => item.value === value);
    if (item) {
      return item;
    }
    return undefined;
  };

  // 获取label方法
  _enum.getLabel = (value) => {
    const item = _enum.getItem(value) as Option<any, any>;
    if (item) {
      return item?.label;
    }
    return undefined;
  };

  // 获取text方法
  _enum.getText = (value) => {
    const item = _enum.getItem(value) as Option<any, any>;
    if (item) {
      return item?.text;
    }
    return undefined;
  };

  // 获取颜色方法
  _enum.getColor = (value, defaultColor) => {
    const item = _enum.getItem(value);
    return item?.color || defaultColor || stringToRGBA(item?.label || item?.title || item?.text);
  };

  // 获取Tag方法
  _enum.getTag = (value) => {
    const item = _enum.getItem(value);
    return _tagRender?.(item || {});
  };

  // 剔除values对应的项
  _enum.omit = (values) => {
    if (!values) return _enum.options;

    const _values = Array.isArray(values) ? values : [values];

    return _enum.options?.filter((item) => !_values.includes(item.value));
  };

  // 获取values对应的项
  _enum.pick = (values) => {
    if (!values) return [];

    const _values = Array.isArray(values) ? values : [values];

    return _enum.options?.filter((item) => _values.includes(item.value));
  };

  // 获取values对应的项
  _enum.prependAll = (allItem) => {
    const _allItem = allItem || __allItem;

    const [value, label, color] = _allItem;

    const _options = _enum.options || [];

    return [{ value, label, title: label, text: label,  color }, ..._options];
  };
}

/**
 * 创建同步枚举
 * @param arg
 */
export function createEnum<T extends Params>(arg: T): EnumOutput<T> {
  const _enum = {} as EnumOutput<T>;

  // 处理 someEnum.YES === 1;
  // @ts-ignore
  Object.entries(arg as object).forEach(([key, [value]]) => (_enum[key] = value));

  // arg 转换为 options
  _enum.options = Object.values(arg as object).map(([value, label, color]) => {
    const options = typeof color === 'object' ? color : { color };
    return { value, label, key: value, title: label, text: label, ...options };
  });

  setEnumFunction<T>(_enum);
  return _enum;
}

/**
 * 创建异步枚举
 * @param arg
 */
export function createAsyncEnum(arg: (...arg:any[]) => Promise<Options<any>>): AsyncEnumProps {
  const _enum: AsyncEnumProps = {} as AsyncEnumProps;

  _enum.options = [];

  // 加载数据函数
  _enum.load = async (...args) => {
    const options = await arg(...args);

    _enum.options = options;

    const _myEnum = createEnum({} as any);
    _myEnum.options = options;

    return _myEnum;
  };

  // 加载数据hooks
  _enum.useLoad = function useLoad(...args) {
    const [myEnum, setMyEnum] = useState<EnumOutput<any>>(createEnum({} as any));

    const argsString = JSON.stringify(args);

    useEffect(() => {
      (async () => {
        // @ts-ignore
        const options = await arg(...args);
        _enum.options = options;

        const _myEnum = createEnum({} as any);
        _myEnum.options = options;

        setMyEnum(_myEnum);
      })();

      // eslint-disable-next-line
    }, [argsString]);

    return myEnum;
  };

  setEnumFunction<any>(_enum);

  return _enum;
}

/**
 * 基于字符串，获取颜色
 * @param str
 * @param defaultAlpha
 * @param defaultRGB
 */
function stringToRGBA(
  str: string | undefined,
  defaultAlpha: number = 1,
  defaultRGB: string = 'rgba(255, 0, 0, 1)',
): string {
  if (!str?.length) return defaultRGB;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }

  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    rgb[i] = (hash >> (i * 8)) & 255;
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${defaultAlpha})`;
}
