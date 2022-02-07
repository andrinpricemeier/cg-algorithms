import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B69A3',
      light: '#035388',
      dark: '#0C6B58'
    },
    secondary: {
      main: '#323F4B',
      light: '#9AA5B1',
      dark: '#1F2933'
    },
  }
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
};

export default MyApp
