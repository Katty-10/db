import React, { useEffect, useState, useMemo, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { io } from 'socket.io-client';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Calendary from 'components/CommonPages/Calendary';
import MySchool from 'components/CommonPages/MySchool';
import CreateEditSchool from 'components/CommonPages/CreateEditSchool';
import MySportsmens from 'components/CommonPages/MySportsmens';
import CreateSportsmen from 'components/CommonPages/CreateSportsmen';
import SportsmenPage from 'components/CommonPages/SportsmenPage';
import MyTraners from 'components/CommonPages/MyTraners';
import CreateTraner from 'components/CommonPages/CreateTraner';
import TranerPage from 'components/CommonPages/TranerPage';
import CreateCompetition from 'components/CommonPages/CreateCompetition';
import CompetitionPage from 'components/CommonPages/CompetitionPage';
import CreateEntries from 'components/CommonPages/CreateEntries';
import MyEntries from 'components/CommonPages/MyEntries';
import EntriePage from 'components/CommonPages/EntriePage';

import AdminSchools from 'components/AdminPages/AdminSchools';
import AdminTraners from 'components/AdminPages/AdminTraners';
import AdminSportsmens from 'components/AdminPages/AdminSportsmens';
import AdminEntries from 'components/AdminPages/AdminEntries';
import AdminPage from 'components/AdminPages/AdminPage';
import ImportResult from 'components/AdminPages/ImportResults';

import PrivateRoute from 'components/PrivateRoute';
import axios from 'axios';
import { auth0Domain } from '../config';
import SocketContext from 'context/SocketContext';

const adminPanelItems = [
    { text: 'Школы', path: '/adminSchools' },
    { text: 'Тренера', path: '/adminTraners' },
    { text: 'Спортсмены', path: '/adminSportsmens' },
    { text: 'Календарь', path: '/calendary' },
    { text: 'Заявки', path: '/adminEntries' },
    { text: 'Админка', path: '/adminPage' },
    { text: 'Загрузка результатов', path: '/adminImportFile' },
];
const userPanelItems = [
    { text: 'Моя Школа', path: '/mySchool' },
    { text: 'Мои Спортсмены', path: '/mySportsmens' },
    { text: 'Тренерский состав', path: '/myTraners' },
    { text: 'Календарь соревнований', path: '/calendary' },
    { text: 'Сформировать заявку', path: '/myEntries' },
];

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));
function Dashboard() {
    const classes = useStyles();
    const { loginWithRedirect, isAuthenticated, logout, user, getAccessTokenSilently } = useAuth0();
    const [admins, setAdmins] = useState(localStorage.getItem('admins') || '[]');

    const socketRef = useRef(io('http://localhost:3001'));

    useEffect(() => {
        return () => socketRef.current.close();
    }, []);

    useEffect(() => {
        const fetchAdmins = async () => {
            const domain = auth0Domain;
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`,
                    scope: 'read:current_user',
                });

                const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

                const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await metadataResponse.json();
                console.log(data);
                // setUserMetadata(user_metadata);
            } catch (e) {
                console.log(e.message);
            }

            // try {
            //     const accessToken = await getAccessTokenSilently({
            //         audience: `https://${domain}/api/v2/`,
            //         scope: 'read:users',
            //     });

            //     const usersUrl = `https://${domain}/api/v2/users/`
            //     const usersResponse = await fetch(usersUrl, {
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //         },
            //     });

            //     const data = await usersResponse.json();
            //     console.log(data);
            // } catch (e) {
            //     console.log(e);
            // }
        };

        if (isAuthenticated) fetchAdmins();
    }, [isAuthenticated]);

    const userId = isAuthenticated && user.sub;
    const isAdmin = isAuthenticated && JSON.parse(admins).some(admin => admin.user_id === userId);

    const shouldRenderDrawer = isAuthenticated;
    const drawerItems = isAdmin ? adminPanelItems : userPanelItems;

    return (
        <SocketContext.Provider value={useMemo(() => ({ socket: socketRef.current }), [])}>
            <Router>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" noWrap>
                                Belarus Canoe DB
                            </Typography>
                            <div style={{ display: 'flex' }}>
                                {!isAuthenticated && (
                                    <Button variant="contained" onClick={() => loginWithRedirect()}>
                                        Войти или Зарегистрироваться
                                    </Button>
                                )}
                                {isAuthenticated && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            logout({ returnTo: window.location.origin });
                                            localStorage.clear();
                                        }}
                                    >
                                        Выйти
                                    </Button>
                                )}
                                {isAuthenticated && (
                                    <div style={{ display: 'flex', marginLeft: '10px' }}>
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            style={{ width: '45px', marginRight: '10px' }}
                                        />
                                        <p>{user.name}</p>
                                    </div>
                                )}
                            </div>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            {isAuthenticated && localStorage.setItem('user', user.sub)}

                            {shouldRenderDrawer && (
                                <List>
                                    {drawerItems.map(({ text, path }, index) => (
                                        <Link to={path}>
                                            <ListItem button key={text}>
                                                <ListItemIcon>
                                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                                </ListItemIcon>
                                                {text}
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            )}
                        </div>
                    </Drawer>

                    <main className={classes.content}>
                        <Toolbar />

                        <Switch>
                            <PrivateRoute exact path="/calendary" component={Calendary} />
                            <PrivateRoute exact path="/competition" component={CompetitionPage} />
                            <PrivateRoute
                                exact
                                path="/createCompetition"
                                component={CreateCompetition}
                            />
                            <PrivateRoute exact path="/mySchool" component={MySchool} />
                            <PrivateRoute
                                exact
                                path="/createEditSchool"
                                component={CreateEditSchool}
                            />
                            <PrivateRoute exact path="/mySportsmens" component={MySportsmens} />
                            <PrivateRoute
                                exact
                                path="/createSportsmen"
                                component={CreateSportsmen}
                            />
                            <PrivateRoute exact path="/sportsmen" component={SportsmenPage} />
                            <PrivateRoute exact path="/myTraners" component={MyTraners} />
                            <PrivateRoute exact path="/createTraner" component={CreateTraner} />
                            <PrivateRoute exact path="/traner" component={TranerPage} />
                            <PrivateRoute exact path="/myEntries" component={MyEntries} />
                            <PrivateRoute exact path="/createEntries" component={CreateEntries} />
                            <PrivateRoute exact path="/entrie" component={EntriePage} />
                            <PrivateRoute exact path="/adminSchools" component={AdminSchools} />
                            <PrivateRoute exact path="/adminTraners" component={AdminTraners} />
                            <PrivateRoute
                                exact
                                path="/adminSportsmens"
                                component={AdminSportsmens}
                            />
                            <PrivateRoute exact path="/adminEntries" component={AdminEntries} />
                            <PrivateRoute exact path="/adminPage" component={AdminPage} />
                            <PrivateRoute exact path="/adminImportFile" component={ImportResult} />
                        </Switch>
                    </main>
                </div>
            </Router>
        </SocketContext.Provider>
    );
}

export default Dashboard;
