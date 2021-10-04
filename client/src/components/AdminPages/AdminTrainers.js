import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { fetchTrainers } from 'services/trainer';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        height: 40,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'ФИО тренера', width: 370 },
    { field: 'birthday', headerName: 'Дата рождения', width: 270 },
    { field: 'school', headerName: 'Школа', width: 180 },
    { field: 'telephone', headerName: 'Телефон', width: 150 },
];

export default function AdminTrainers() {
    const history = useHistory();

    const { data: trainersData } = useQuery('trainers', fetchTrainers);
    const { trainers } = trainersData || {};
    const formattedTrainers = trainers?.map(trainer => ({ ...trainer, id: trainer._id }));

    const classes = useStyles();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h3" component="h4" gutterBottom>
                    Тренеры
                </Typography>

                <Paper component="form" className={classes.root}>
                    <InputBase
                        className={classes.input}
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            {formattedTrainers && (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={formattedTrainers}
                        columns={columns}
                        pageSize={15}
                        className="table-style"
                        onRowClick={e => {
                            history.push(`/trainer/${e.row.id}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
