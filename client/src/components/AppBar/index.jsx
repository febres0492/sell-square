import Auth from "../../utils/auth";
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button'; // Import Button component
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'; // Import Link component

// Define your styles using makeStyles
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    homeButton: {
        marginLeft: theme.spacing(2),
    },
}));

const MyComponent = ({ open, handleDrawerOpen }) => {
    const classes = useStyles();
    const loggedIn = Auth.loggedIn();

    return (
        <AppBar position="" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar>
                {/* <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon />
                </IconButton> */}
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Dashboard
                </Typography>
                <Button color="inherit" className={classes.homeButton} component={Link} to="/">Home</Button>
                {loggedIn && (<>
                    <Button color="inherit" className={classes.homeButton} component={Link} to="/dashboard">Dashboard</Button>
                    <Button color="inherit" className={classes.homeButton} component={Link} to="/accountSettings">Account</Button>
                    <Button color="inherit" className={classes.homeButton} to="/" onClick={Auth.logout}>Logout</Button>
                </>)}
                {!loggedIn && (<>
                    <Button color="inherit" className={classes.homeButton} component={Link} to="/signup">Signup</Button>
                    <Button color="inherit" className={classes.homeButton} component={Link} to="/login">Login</Button>
                </> )}
            </Toolbar>
        </AppBar>
    );
};

export default MyComponent;