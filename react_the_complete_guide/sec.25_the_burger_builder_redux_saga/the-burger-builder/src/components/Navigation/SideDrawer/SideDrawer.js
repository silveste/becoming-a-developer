import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import classes from './SideDrawer.module.css';

const sideDrawer = (props) => {
  const attachedClasses = [classes.SideDrawer];
  if (props.open) {
    attachedClasses.push(classes.Open);
  } else {
    attachedClasses.push(classes.Close);
  }
  return (
    <>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <div className={classes.Logo}><Logo /></div>
        <nav>
          <NavigationItems isAuth={props.isAuth}/>
        </nav>
      </div>
    </>
  );
}

export default sideDrawer;
