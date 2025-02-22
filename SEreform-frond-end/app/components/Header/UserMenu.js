/** @format */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
// import dummy from 'dan-api/dummy/dummyContents';
import { Box, Typography } from '@mui/material';
import { hostBackend } from '../../../env';

// import useStyles from './header-jss';

function UserMenu() {
  // const { classes, cx } = useStyles();

  // -------------------- getCookie
  const username = Cookies.get('._jwtUsername');
  const role = Cookies.get('._jwtRole');
  // ===============================

  // ======================= use state ================================
  const [isLogin, setIslogin] = useState(false);
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    openMenu: null,
  });
  // -------------------- set username and role !!Nosql
  const [user, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [showname, setShowname] = useState('');
  const [showstatus, setShowstate] = useState('');
  const [thumbuser, Setthumbuser] = useState([]);
  const [ShowImage, SetShowimage] = useState([]);
  // ======================== end usestate   ================================
  // ======================== use effect =================================
  // -------------------- verify jwt
  useEffect(() => {
    axios
      .post(`${hostBackend}/api/verify_authen`, {
        token: username,
        tokenRole: role,
      })
      .then((data) => {
        setUsername(data.data.User);
        setStatus(data.data.stateRole);
      });
  }, []);
  // ------------------- Fetch Data FristName Student && Teacher && admin
  useEffect(() => {
    if (user !== undefined) {
      if (status === 'นักศึกษา') {
        axios
          .post(`${hostBackend}/api/ReadStudent`, { username: user })
          .then((data) => {
            Setthumbuser(data.data);
            const setFristName = data.data[0].first_name;
            setShowname(setFristName);
            setShowstate(status);
          });
      }
      if (status === 'อาจารย์') {
        axios
          .post(`${hostBackend}/api/ReadTeacher`, { username: user })
          .then((data) => {
            const setFristName = data.data[0].first_name;
            Setthumbuser(data.data);
            setShowname(setFristName);
            setShowstate(status);
          });
      }
      if (status === 'admin') {
        axios
          .post(`${hostBackend}/api/ReadAdmin`, { username: user })
          .then((data) => {
            const setFristName = data.data[0].first_name;
            Setthumbuser(data.data);
            setShowname(setFristName);
            setShowstate(status);
          });
      }
    }
  }, [user, status]);
  // -------------------- set state switch login
  useEffect(() => {
    if (username !== undefined && role !== undefined) {
      setIslogin(true);
    }
  }, [username]);
  // --------------------- set image
  // ${urlImage}/student/${data.image}
  useEffect(() => {
    if (thumbuser !== undefined) {
      if (status === 'นักศึกษา') {
        // let ImageValue;
        const promises = Object.values(thumbuser).map((data) => import(`../../../image/student/${data.image}`).then((image) => image.default));
        Promise.all(promises).then((imagePaths) => {
          const ImageValue = [];
          imagePaths.forEach((index) => ImageValue.push(index));
          SetShowimage(ImageValue);
        });
      }
      if (status === 'อาจารย์') {
        const promises = Object.values(thumbuser).map((data) => import(`../../../image/teacher/${data.image}`).then((image) => image.default));
        Promise.all(promises).then((imagePaths) => {
          const ImageValue = [];
          imagePaths.forEach((index) => ImageValue.push(index));
          SetShowimage(ImageValue);
        });
      }
    }
  }, [thumbuser]);
  // ======================= end effect ===============================
  const handleMenu = (menu) => (event) => {
    const { openMenu } = menuState;
    setMenuState({
      openMenu: openMenu === menu ? null : menu,
      anchorEl: event.currentTarget,
    });
  };
  // ButtonLogout and Remove Token
  const handleClose = () => {
    setMenuState({ anchorEl: null, openMenu: null });
  };
  // handleLogout
  const handleLogout = () => {
    Cookies.remove('._jwtUsername');
    Cookies.remove('._jwtRole');
    setTimeout(() => {
      setIslogin(false);
    }, 1000);
    window.location.href = '/';
  };
  const { anchorEl, openMenu } = menuState;
  return (
    <div>
      {/* islogin ? (ture) : (false) */}
      {isLogin ? (
        <div
          style={{
            width: 200,
            display: 'flex',
            flexWrap: 'wrap',
          }}>
          <Box
            sx={{
              margin: 'auto',
              textAlign: 'right',
              verticalAlign: 'middle',
            }}>
            <Typography
              sx={{
                fontSize: '14px',
              }}>
              สวัสดีคุณ {showname}
            </Typography>
            <Typography sx={{ fontSize: '12px', lineHeight: 0.7 }}>
              สถานะ : {showstatus}
            </Typography>
          </Box>
          <Button onClick={handleMenu('user-setting')}>
            <Avatar
              alt={showname}
              src={ShowImage}
              sx={{ width: '50px', height: '50px' }}
            />
          </Button>
        </div>
      ) : (
        <Button
          // onClick={toggle}
          href='/Portallogin'
          variant='text'
          sx={{
            width: 100,
            color: '#373737',
            // backgroundColor: '#fff',
            border: '1px solid transparent',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(to right, #FE6F41, #F8BA1C) border-box',

            ':hover': {
              color: '#FFF',
              background: '#FE6F41',
              border: '0px solid #FE6F41',
            },
          }}>
          Login
        </Button>
      )}
      <div>
        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          open={openMenu === 'user-setting'}
          onClose={handleClose}
          placement='bottom-start'>
          <MenuItem component={Link} to='/Portal'>
            ShortCut Menu
          </MenuItem>
          <MenuItem component={Link} to='/Backoffice/personel'>
            My Profile
          </MenuItem>
          <Divider />
          {/* Login Zone */}
          <MenuItem onClick={handleLogout} component={Link}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            Log Out
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default UserMenu;
