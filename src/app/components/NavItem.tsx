import { useState } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  linksTo: string;
  label: string;
  icon: string;
}

const NavItem = (props: Props) => {
  const { linksTo, label, icon } = props;

  return (
    <NavLink to={linksTo} exact className="nav__item" activeClassName="active">
      <i className={`icon icon--base nav__item--${icon}`}></i>
      <span className={`nav__item__label`}>{label}</span>
    </NavLink>
  );
};

export default NavItem;
