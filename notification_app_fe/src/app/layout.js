"use client";
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import './globals.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Affordmed Notifications
              </Typography>
              <Button color="inherit" component={Link} href="/">Priority Inbox</Button>
              <Button color="inherit" component={Link} href="/all">All Notifications</Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
