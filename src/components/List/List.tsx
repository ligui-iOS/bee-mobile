import * as React from 'react';
import * as classNames from 'classnames';
import {ListProps} from './PropsType';

export default class List extends React.PureComponent<ListProps, {}> {
    static defaultProps = {
        disableRipple: true
    };

    render() {
        const {children: childrenProps, className, disableRipple, ...other} = this.props;
        const styleClass = classNames(
            'List', className
        );
        const children = React.Children.map(childrenProps, (child: React.ReactElement<any>, index: number) => {
            if (!React.isValidElement(child)) {
                return;
            }
            const props: any = {...child.props};
            props['index'] = index;
            props['disableRipple'] = disableRipple!;
            return React.cloneElement(child, props);
        });
        return (
            <ul className={styleClass} {...other}>
                {children}
            </ul>
        );
    }
}