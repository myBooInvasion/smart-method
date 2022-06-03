import React, {useState, useEffect} from 'react'
import {
    IconButton, Box
} from '@mui/material';
import {
    MenuRounded, MenuOpenRounded
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

function ContentComp(props) {

    let [aside, setAside] = useState(null);
    useEffect(() => {
        setAside(document.querySelector('aside.sider').offsetWidth);
    }, []);

    return (
        <Box
            component={'section'}
            className='container-fluid content mx-0' sx={{width: {xs: '100%', lg: `calc(100% - ${aside + 1}px)`}}}>
            <div className='row align-items-center py-2' style={{backgroundColor: '#2b2c3e'}}>
                <div className='col text-start'>
                    <IconButton sx={{ display: { lg: 'none' }, color: '#f3f3f4' }} onClick={() => props.toggleDrawer()}>
                        <MenuRounded />
                    </IconButton>
                    <IconButton sx={{ display: { xs: 'none', lg: 'inline-flex' }, color: '#f3f3f4' }}>
                        <MenuOpenRounded />
                    </IconButton>
                </div>
                <div className='col text-start'>
                    <h5>Ga tau nanti diisi apa...</h5>
                </div>
            </div>

            <Outlet />
        </Box>
    )
}

export default ContentComp