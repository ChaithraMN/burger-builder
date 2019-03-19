import React from 'react';
import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' }
];
const buildControls = (props) => (
    <div className={classes.BuildControls}>
    <p>Current price: <strong>{props.totalPrice.toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl
                more={() => props.more(ctrl.type)}
                less={() => props.less(ctrl.type)}
                key={ctrl.label}
                label={ctrl.label}
                disabled={props.disabled[ctrl.type]} />
        ))}
        <button disabled={!props.purchasable} onClick = {props.purchaseHandler} className = {classes.OrderButton}>Order NOW</button>
    </div>
);

export default buildControls;