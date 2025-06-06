import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Header() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar className="container">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Forum App
                </Typography>
                <Button color="inherit">Login</Button>
                <Button color="inherit">Sign Up</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
