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

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
const App = () => {

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [doneItems, setDoneItems] = useState<TodoItem[]>([]);
  const [todoItemText, setTodoItemText] = useState(''); // text of the new to-do item [controlled component
  const [searchText, setSearchText] = useState('');

  const fetchIncompleteItems = async () => {
    try {
      const resp =  await fetch('/api/todo?completed=false');
      if (resp.status === 500) {
        throw new Error('Internal Server Error');
      }
      const data = await resp.json();
      setTodoItems(data)
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const fetchDoneItems = async () => {
    try {
      const resp = await fetch('/api/todo?completed=true');
      if (resp.status === 500) {
        throw new Error('Internal Server Error');
      }
      const data = await resp.json();
      setDoneItems(data)
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  useEffect(() => {
    // fetch to-do and done items from the API
    fetchIncompleteItems();
    fetchDoneItems();
  }, []);

  const handleAddTodoItem = async () => {
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: todoItemText,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const data = await response.json();
      setTodoItems(todoItems => [...todoItems, data]);
      setTodoItemText('');
    } catch (error) {
      console.error(error);
      // Handle the error, such as displaying an error message to the user or retrying the request
    }
  };
  const handleSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleCheckboxChange = async (event: any, id: string) => {
    try {
      const { checked } = event.target;
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: checked }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedItem = { ...todoItems.find((item: { id: string; }) => item.id === id), completed: checked };
      setTodoItems((todoItems: any[]) => {
        const itemIndex = todoItems.findIndex((item: { id: string; }) => item.id === id);
        return [...todoItems.slice(0, itemIndex), updatedItem, ...todoItems.slice(itemIndex + 1)];
      });
    } catch (error) {
      console.error(error);
      // Handle the error, such as displaying an error message to the user or retrying the request
    }
  };

  const handleDeleteAllTasksClick = async () => {
    try {
      const response = await fetch('/api/todo', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete tasks');
      }
      setTodoItems([]);
      setDoneItems([]);
    } catch (error) {
      console.error(error);
      // Handle the error, such as displaying an error message to the user or retrying the request
    }
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
              {todoItems?.map((item) => (
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
              {doneItems?.map((item) => (
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