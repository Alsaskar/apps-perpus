import {Callout} from '@blueprintjs/core'

export const Alert = ({
    message,
    title,
    intent,
    style
}) => {
    return(
        <Callout
            intent={intent}
            title={title}
            style={style}
        >
            {message}
        </Callout>
    )
}