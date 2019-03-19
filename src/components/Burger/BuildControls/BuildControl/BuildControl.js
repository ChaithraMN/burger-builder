import React from 'react';
import classes from './BuildControl.css';

const BuildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button
            onClick={props.less}
            disabled={props.disabled}
            className={classes.Less}>Less</button>
        <button
            onClick={props.more}
            className={classes.More}>More</button>
    </div>
);

export default BuildControl;
