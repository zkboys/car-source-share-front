import { SpinLoading } from 'antd-mobile'
import s from './index.module.less'

export function GlobalLoading() {
    return <div className={s.root}><SpinLoading color="primary" /></div>
}