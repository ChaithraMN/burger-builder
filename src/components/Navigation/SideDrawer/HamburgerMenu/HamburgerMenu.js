import React from 'react';
import menuPath from '../../../../assets/images/hamburger-menu.png';
import classes from './HamburgerMenu.css';

const hamburgerMenu = (props) => (
    <div onClick={props.toggle} className={classes.HamburgerMenu}>
        <img src = {menuPath}/>
    </div>
);

export default hamburgerMenu;