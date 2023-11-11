import { Container, Grid } from '@mui/material';
import Script from 'next/script';
import React from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const Layout = (props: any) => {
    const { children } = props;
    return (
        <div className='layout'>
            <Script src="/gl-matrix.js"/>
            <NavBar />
            <Grid container spacing={2} sx={{ marginBottom: 2, marginTop: 2}}>
                <Grid item sm={3}>
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