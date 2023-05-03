import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Accordion from '@mui/material/Accordion';
import classes from './index.module.css';

const App = () => {

  // const classes = makeStyles({
  //   root: {
  //     flexGrow: 1,
  //   },
  //   appBar: {
  //     backgroundColor: '#fff',
  //     color: '#000',
  //   },
  //   title: {
  //     flexGrow: 1,
  //   },
  //   // paper: {
  //   //   padding: theme.spacing(2),
  //   //   color: theme.palette.text.secondary,
  //   // },
  //   // form: {
  //   //   display: 'flex',
  //   //   alignItems: 'center',
  //   //   marginBottom: theme.spacing(2),
  //   // },
  //   // search: {
  //   //   marginRight: theme.spacing(2),
  //   // },
  //   // checkbox: {
  //   //   paddingRight: theme.spacing(1),
  //   // },
  //   deleteButton: {
  //     marginLeft: 'auto',
  //   },
  // });
  const [todoItems, setTodoItems] = useState<any>([]);
  const [doneItems, setDoneItems] = useState<any>([]);
  const [todoItemText, setTodoItemText] = useState(''); // text of the new to-do item [controlled component
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // fetch to-do and done items from the API
  }, []);

  const handleAddTodoItem = () => {
    // add new to-do item to the API
  };

  const handleSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleCheckboxChange = (event, id) => {
    // update the status of the item with the given id in the API
  };

  const handleDeleteAllTasksClick = () => {
    // delete all tasks from the API
  };

  return (
    <div className={classes.root}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.title} sx={{ mr: 2 }}>
              Todo List
            </Typography>
            <Typography variant="h6" color="inherit" component="div">
              <div className={classes.deleteButton} onClick={handleDeleteAllTasksClick}>
                <DeleteIcon /> Delete all tasks
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <br />
      <br />
      <div className={classes.mainWrapper}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} spacing={1}>
            <Paper className={classes.paper}>
              <div className={classes.form} onSubmit={handleAddTodoItem}>
                <TextField
                  label="Add new task"
                  variant="outlined"
                  fullWidth
                  required
                  value={todoItemText}
                  onChange={(event) => setTodoItemText(event.target.value)}
                />
              </div>
              </Paper>
              <Button type="submit" variant="contained" color="primary">
                  Add
              </Button>
              {todoItems.map((item) => (
                <div key={item.id}>
                  <FormControlLabel
                    control={<Checkbox checked={item.completed} onChange={(event) => handleCheckboxChange(event, item.id)} name="checked" />}
                    label={item.text}
                    className={classes.checkbox}
                  />
                </div>
              ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <TextField
                label="Search tasks"
                variant="outlined"
                fullWidth
                className={classes.search}
                value={searchText}
                onChange={handleSearchTextChange}
              />
              {doneItems.map((item) => (
                <div key={item.id}>
                  <FormControlLabel
                    control={<Checkbox checked={item.completed} name="checked" />}
                    label={item.text}
                    disabled
                    className={classes.checkbox}
                  />
                </div>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default App;