import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ContactsRoundedIcon from '@material-ui/icons/ContactsRounded';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import HomeIcon from '@material-ui/icons/Home';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ListAltIcon from '@material-ui/icons/ListAlt';

import React from 'react';
import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { StyledMenu, StyledMenuItem, linkStyle} from './styles';
import { makeLogout, rolesMap, makeReditect, api, opt, verifyAuth } from '../../Utils'
import Error from '../../Pages/Error';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState();
  const history = useHistory();
  let redirect = {
    state: false,
    where: ''
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(!anchorEl);
  };

  const handleCloseLogout = () => {
    setAnchorEl(!anchorEl);
    makeLogout()
  };

  const menuButtonStyles = {
      background: 'linear-gradient(45deg, #336ec2 10%, #07D6A8 100%)',
      border: '1px solid #ffffff',
      marginLeft: '-10px',
      boxShadow: '3px 3px 3px 0 rgba(69, 90, 100, 0.9)',
      width: '100px'
  };

  function makeRed(to) {
    const auth_token = localStorage.getItem('auth_token');
    if (auth_token) {
        window.location = 'http://127.0.0.1:3000' + to;
    } else {
        window.location = 'http://127.0.0.1:3000' + '/login';
    }
}

  function handlePermission(properUrl, permission = rolesMap.default) {
    const auth_token = JSON.parse(localStorage.getItem('auth_token'));
    const token = auth_token.token;
    const now = new Date();
    const urlUser = api.get.auth.user.uuid;
    
    if (!auth_token) {
      makeRed('/login')
    } else {
        if (now.getTime() > token.expire) {
            localStorage.removeItem('auth_token')
            makeRed('/login');
        } else {
            axios.get(urlUser + token, opt).then(
                function(res) {
                    let arr = [];
                    for (var key in rolesMap) {
                        arr.push(rolesMap[key]);
                    }
                    
                    const map = arr.slice(arr.indexOf(permission)); 
                    const userRole = res.data.role_id;
    
                    if (map.includes(userRole)) {
                      makeRed(properUrl);
                    } else {
                      // verifyAuth(Error)
                      makeRed('/error');
                    }
                }
            ).catch(
                function(error) {
                    console.log(error)
                }
            );
        }
    }
  }

  return (
    <div >
      <Button style={menuButtonStyles} aria-controls='customized-menu' aria-haspopup='true' variant='contained' onClick={handleClick} >
        <p style={{color: 'white'}}>Menu</p>
      </Button>

      <StyledMenu id='customized-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <NavLink to='/' style={linkStyle}>
          <StyledMenuItem onClick={handleClose}>
              <ListItemIcon >
                <HomeIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Home' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/profile' style={linkStyle}>
          <StyledMenuItem onClick={handleClose}>
              <ListItemIcon >
                <ContactsRoundedIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Profile' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/container' style={linkStyle}>
          <StyledMenuItem onClick={handleClose}>
              <ListItemIcon >
                <ListAltIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Containers' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/users' style={linkStyle} onClick={() => { handlePermission('/users', rolesMap.manager) }} >
          <StyledMenuItem onClick={handleClose}>
              <ListItemIcon >
                <PeopleAltIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Users' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/organisation' style={linkStyle} onClick={() => { handlePermission('/organisation', rolesMap.admin) }} >
          <StyledMenuItem onClick={handleClose}>
              <ListItemIcon >
                <SupervisedUserCircleIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Organisation' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/about' style={linkStyle}>
          <StyledMenuItem onClick={handleClose}>
            <ListItemIcon >
              <InfoIcon fontSize='small' />
            </ListItemIcon>
              <ListItemText primary='About' />
          </StyledMenuItem>
        </NavLink>

        <NavLink to='/login' style={linkStyle}>
          <StyledMenuItem onClick={handleCloseLogout}>
            <ListItemIcon >
              <ExitToAppRoundedIcon fontSize='small' />
            </ListItemIcon>
              <ListItemText primary='Log out' />
          </StyledMenuItem>
        </NavLink>

      </StyledMenu>
    </div>
  );
}

export default CustomizedMenus;
