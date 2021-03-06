import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCSRFToken,
  getAccessToken,
  getPasswordsList,
  getPassword,
  updatePasswordAction,
  deletePasswordAction,
  createPasswordAction
} from './store/actions/usersActions';
import querystring from 'querystring';
import StickyFooter from './StickyFooter';
import SignIn from './SignIn';
import VerifyPackingKey from './VerifyPackingKey';
import ResponsiveAppBar from './ResponsiveAppBar';
import './App.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import { DataGrid, GridColDef, GridApi, useGridApiContext, GridCellValue, useGridState } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Grid from '@mui/material/Grid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialog({
  entry,
  rowsState,
  setRowsState,
  openBackdrop,
  setOpenBackdrop,
  name,
  setName
}) {

  const [passwordName, setPasswordName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [metatag, setMetatag] = useState("");
  const [notes, setNotes] = useState("");

  const [open, setOpen] = useState(false);
  const user_state = useSelector(state => state.user_state);
  const dispatch = useDispatch();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);

  const handleOpenDeleteConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleClickOpen = async () => {
    try {
      setPasswordName(entry.getValue(entry.id, 'name') ?? '');
      setUserId(entry.getValue(entry.id, 'field_user_id') ?? '');
      setPassword(entry.getValue(entry.id, 'field_password') ?? '');
      setLink(entry.getValue(entry.id, 'field_link') ?? '');
      setEmail(entry.getValue(entry.id, 'field_email') ?? '');
      setMetatag(entry.getValue(entry.id, 'metatag') ?? '');
      setNotes(entry.getValue(entry.id, 'field_notes') ?? '');
    } catch (error) {
      console.log(error);
    }
    setOpen(true);
  };

  const updatePassword = async event => {
    event.preventDefault();
    var data = new FormData(event.currentTarget);
    var fields = [];
    for (var [key, value] of data.entries()) {
      fields[key] = value;
    }
    fields['uuid'] = entry.getValue(entry.id, 'uuid');

    setOpen(false);

    (async () => {
      setOpenBackdrop(true);
      var csrf = await dispatch(getCSRFToken());
      var response = await dispatch(updatePasswordAction(csrf, user_state.access_token, fields));
      let target = entry.row.index;
      --target;
      rowsState.rows[target].name = fields['name'];
      rowsState.rows[target].field_user_id = fields['user-id'];
      rowsState.rows[target].field_password = fields['password'];
      rowsState.rows[target].field_link = fields['link'];
      rowsState.rows[target].field_email = fields['email'];
      rowsState.rows[target].metatag = fields['tags'];
      rowsState.rows[target].field_notes = fields['notes'];
      let changed = new Date(response.data.data.attributes.changed);
      changed = changed.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
      });
      rowsState.rows[target].changed = changed;
      const newRows = await refreshRows(
        rowsState,
      );
      setRowsState((prev) => ({ ...prev, rows: newRows }));
      setOpenBackdrop(false);
    })();
  };

  const deletePassword = async () => {
    setOpenConfirmation(false);
    let uuid = entry.getValue(entry.id, 'uuid');

    (async () => {
      setOpenBackdrop(true);
      var csrf = await dispatch(getCSRFToken());
      await dispatch(deletePasswordAction(csrf, user_state.access_token, uuid));
      const newRows = await loadServerRows(
        dispatch,
        user_state.access_token,
        name,
        rowsState.page,
        rowsState.pageSize,
      );
      setRowsState((prev) => ({ ...prev, rows: newRows }));
      setOpenBackdrop(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={openConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm delete action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete '{entry.getValue(entry.id, 'name')}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>No</Button>
          <Button onClick={deletePassword}>Yes</Button>
        </DialogActions>
      </Dialog>
      <label>
        <IconButton onClick={handleClickOpen} color="primary" aria-label="Edit entry" component="span">
          <EditIcon />
        </IconButton>
      </label>
      <label>
        <IconButton onClick={handleOpenDeleteConfirmation} color="primary" aria-label="Edit entry" component="span">
          <DeleteForeverIcon />
        </IconButton>
      </label>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <Box
          component="form"
          onSubmit={updatePassword}
          noValidate
          autoComplete="off"
        >
          <DialogTitle id="alert-dialog-title">
            {"Entry Details"}
          </DialogTitle>
          <DialogContent>
              <br />
              <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      size="small"
                      value={passwordName}
                      onChange={e => setPasswordName(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="user-id"
                      label="User ID"
                      name="user-id"
                      size="small"
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      size="small"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="link"
                      label="Link"
                      name="link"
                      size="small"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      size="small"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="tags"
                      label="Tags"
                      name="tags"
                      size="small"
                      value={metatag}
                      onChange={e => setMetatag(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                  <Grid item style={{ width: '90%' }}>
                    <TextField
                      fullWidth
                      id="notes"
                      label="Notes"
                      name="notes"
                      size="small"
                      multiline
                      rows={8}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

const theme = createTheme({
    palette: {
      secondary: {
        main: '#292929',
      }
    },
});

function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

  return (
    <ThemeProvider theme={theme}>
        <Pagination
        color="secondary"
        count={state.pagination.pageCount}
        page={state.pagination.page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    </ThemeProvider>
  );
}

const loadServerRows = (dispatch, access_token, name, page, page_size) =>
  new Promise((resolve) => {
    resolve(dispatch(getPasswordsList(access_token, name, page, page_size)));
  });

const refreshRows = (rowsState) =>
  new Promise((resolve) => {
    resolve(rowsState.rows);
  });

function App() {
  const [loggedIn, setLoggedIn] = useState();
  const [packingKey, setPackingKey] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const user_state = useSelector(state => state.user_state);
  const dispatch = useDispatch();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openAddNew, setOpenAddNew] = useState(false);

  const [rowsState, setRowsState] = React.useState({
    page: 0,
    pageSize: 10,
    rows: [],
    loading: false,
  });

  const createPassword = async event => {
    event.preventDefault();
    var data = new FormData(event.currentTarget);
    var fields = [];
    for (var [key, value] of data.entries()) {
      fields[key] = value;
    }

    setOpenAddNew(false);

    (async () => {
      setOpenBackdrop(true);
      var csrf = await dispatch(getCSRFToken());
      var response = await dispatch(createPasswordAction(csrf, user_state.access_token, fields));
      setOpenBackdrop(false);
    })();
  };

  const handleClickOpenAddNew = () => {
    setOpenAddNew(true);
  };

  const handleCloseAddNew = () => {
    setOpenAddNew(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'name', width: 600 },
    { field: 'field_email', headerName: 'Email', width: 150 , hide: true },
    { field: 'field_link', headerName: 'Link', width: 150 , hide: true },
    { field: 'field_user_id', headerName: 'User ID', width: 150 , hide: true },
    { field: 'field_password', headerName: 'Password', width: 150 , hide: true },
    { field: 'field_notes', headerName: 'Notes', width: 600, hide: true },
    { field: 'metatag', headerName: 'Metatag', width: 150, hide: true },
    { field: 'uuid', headerName: 'UUID', width: 150, hide: true },
    { field: 'changed', headerName: 'Changed', width: 200 },
    { field: 'created', headerName: 'Created', width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return <AlertDialog
        entry={params}
        rowsState={rowsState}
        setRowsState={setRowsState}
        openBackdrop={openBackdrop}
        setOpenBackdrop={setOpenBackdrop}
        name={name}
        setName={setName}
      />;
      }
    }
  ];

  React.useEffect(() => {
  }, []);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    let active = true;
    (async () => {
      setOpenBackdrop(true);
      const newRows = await loadServerRows(
        dispatch,
        user_state.access_token,
        name,
        rowsState.page,
        rowsState.pageSize,
      );
      if (!active) {
        return;
      }
      setRowsState((prev) => ({ ...prev, rows: newRows }));
      setOpenBackdrop(false);
    })();

    return () => {
      active = false;
    };

  }, [rowsState.page, rowsState.pageSize]);

  if(!loggedIn) {
    return <SignIn setLoggedIn={setLoggedIn} setName={setName} savePassword={setPassword} />
  }

  if(!packingKey) {
    return <VerifyPackingKey savePackingKey={setPackingKey} name={name} setRowsState={setRowsState} />
  }

  return (
    <div className = "App" >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <React.Fragment>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
        <ResponsiveAppBar setLoggedIn={setLoggedIn} />
          <div className="wrapper">
            <Dialog
              open={openAddNew}
              onClose={handleCloseAddNew}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              fullWidth
              maxWidth="md"
            >
              <Box
                component="form"
                onSubmit={createPassword}
                noValidate
                autoComplete="off"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Entry Details"}
                </DialogTitle>
                <DialogContent>
                    <br />
                    <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                      <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            size="small"
                          />
                        </Grid>
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="user-id"
                            label="User ID"
                            name="user-id"
                            size="small"
                          />
                        </Grid>
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            size="small"
                          />
                        </Grid>
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="link"
                            label="Link"
                            name="link"
                            size="small"
                          />
                        </Grid>
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            size="small"
                          />
                        </Grid>
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="tags"
                            label="Tags"
                            name="tags"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                      <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                        <Grid item style={{ width: '90%' }}>
                          <TextField
                            fullWidth
                            id="notes"
                            label="Notes"
                            name="notes"
                            size="small"
                            multiline
                            rows={8}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAddNew}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    autoFocus
                  >
                    OK
                  </Button>
                </DialogActions>
              </Box>
            </Dialog>
            <br />
            <br />
            <div
              style={{
                  display: 'flex',
                  justifyContent: 'center'
              }}
            >
              <div
                style={{
                    'marginBottom': '40px',
                    height: 650,
                    width: '90%'
                }}
              >
                <div
                  style={{
                    'marginBottom': '20px',
                  }}
                >
                  <Stack direction="row" spacing={2} justifyContent="right">
                    <Button onClick={handleClickOpenAddNew} variant="contained" endIcon={<NoteAddIcon />}>
                      Add New
                    </Button>
                  </Stack>
                </div>
                <DataGrid
                  columns={columns}
                  pagination
                  components={{
                    Pagination: CustomPagination,
                  }}
                  rowCount={parseInt(user_state.count, 10)}
                  {...rowsState}
                  paginationMode="server"
                  onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                  disableColumnMenu
                  disableSelectionOnClick
                />
              </div>
            </div>
            <br />
            <br />
          </div>
          <StickyFooter />
        </Box>
      </React.Fragment>
    </div>
  );
}

export default App;
