import { Container, Grid } from '@mui/material';
import React from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const Layout = (props: any) => {
    const { children } = props;
    return (
        <div className='layout'>
            <NavBar />
            <Grid container spacing={2} sx={{ margin: 2 }}>
                <Grid item sm={2}>
                    <aside>
                        <Sidebar />
                    </aside>
                </Grid>
                <Grid item sm={9}>
                    <main>
                        {children}
                    </main>
                </Grid>
            </Grid>
            <Footer />
        </div>
    )
}

export default Layout;