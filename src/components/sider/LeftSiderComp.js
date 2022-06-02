import React from 'react';
import {
    Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import {
    AssignmentOutlined, AltRouteRounded
} from '@mui/icons-material';
import {NavLink } from 'react-router-dom';

function LeftSiderComp() {

    const iconComp = [
        <AltRouteRounded sx={{color: '#f3f3f4'}} />,
        <AssignmentOutlined sx={{color: '#f3f3f4'}} />,
    ];
    const listText = ['Alternatif', 'Results'];

    return (
        <Box component={'aside'} className='sider position-fixed min-vh-100 start-0 top-0 d-none d-lg-block'
            sx={{backgroundColor: '#2b2c3e'}}>
            <List disablePadding className='text-start'>
                <img src={require('../../assets/images/logo-react.png')} alt='brand-logo'
                    className='py-2 px-4'
                    style={{ width: '5.5rem' }} />
            </List>
            <Divider sx={{borderColor: '#94979f'}} />
            <List disablePadding dense sx={{my: 3}}>
                {iconComp.map((item, id) => {
                    return (
                        <ListItem key={id}>
                            <NavLink
                                to={id === 0? '/':'/'.concat(listText[id]).toLowerCase()}
                                className={({ isActive }) => isActive ?
                                    'w-100 text-decoration-none text-secondary text-white active' : 'w-100 text-decoration-none text-white'} style={{borderRadius: '.25rem'}}>
                                <ListItemButton sx={{ borderRadius: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {item}
                                    </ListItemIcon>
                                    <ListItemText primary={listText[id]} />
                                </ListItemButton>
                            </NavLink>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

export default LeftSiderComp;