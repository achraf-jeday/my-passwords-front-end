import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { DataGrid, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

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

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${
        params.getValue(params.id, 'lastName') || ''
      }`,
  },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    renderCell: (params) => {
      return <AlertDialog />;
    }
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 10, lastName: 'Jeday', firstName: 'Achraf', age: 35 },
  { id: 11, lastName: 'Jeday', firstName: 'Ahmed', age: 87 },
  { id: 12, lastName: 'Jeday', firstName: 'Wassim', age: 43 },
];

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://www.passwordlocker.me/">
        Password Locker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <label>
        <IconButton onClick={handleClickOpen} color="primary" aria-label="Edit entry" component="span">
          <EditIcon />
        </IconButton>
      </label>
      <label>
        <IconButton onClick={handleClickOpen} color="primary" aria-label="Edit entry" component="span">
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
        <DialogTitle id="alert-dialog-title">
          {"Entry Details"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <br />
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
              <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="name" label="Name" size="small" />
                </Grid>
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="user-id" label="User ID" size="small" />
                </Grid>
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="password" label="Password" size="small" type="password" />
                </Grid>
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="link" label="Link" size="small" />
                </Grid>
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="email" label="Email" size="small" />
                </Grid>
                <Grid item style={{ width: '90%' }}>
                  <TextField fullWidth id="tags" label="Tags" size="small" />
                </Grid>
              </Grid>
              <Grid container item spacing={2} xs={6} direction={"column"} justifyContent="center" alignItems="center">
                <Grid item style={{ width: '90%' }}>
                  <TextField
                    fullWidth
                    id="notes"
                    label="Notes"
                    size="small"
                    multiline
                    rows={8}
                    maxRows={10}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function StickyFooter() {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
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
                height: 650,
                width: '50%'
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
        <br />
        <br />
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              My sticky footer can be found here.
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </React.Fragment>
  );
}