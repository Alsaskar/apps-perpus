import {Elevation, Icon, IconSize, H2, H3, Card} from '@blueprintjs/core'

const CardCount = ({title, subtitle, background, color, colorTitle, icon, count}) => {
    return (
        <Card 
            elevation={Elevation.TWO} 
            style={{
                backgroundColor: background,
                color: color
            }}
        >
            <H3 style={{color: colorTitle, textAlign: 'center'}}><Icon icon={icon} size={IconSize.LARGE}/> {title}</H3>
            <p align="center">{subtitle}</p>
            <H2 style={{color: colorTitle, textAlign: 'center'}}>{count}</H2>
        </Card>
    )
}

export default CardCount