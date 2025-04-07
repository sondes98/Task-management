import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setTasks, setLoading, setError, removeTask} from '../features/tasks/tasksSlice';
import { fetchTasks, deleteTask} from '../features/tasks/tasksApi';
import {TaskStatus, TaskPriority } from '../features/tasks/types';



const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        dispatch(setLoading(true));
        const tasksData = await fetchTasks();
        dispatch(setTasks(tasksData));
      } catch (err) {
        dispatch(setError('Failed to fetch tasks'));
      }
    };
    
    loadTasks();
  }, [dispatch]);
  
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      dispatch(removeTask(id));
    } catch (err) {
      dispatch(setError('Failed to delete task'));
    }
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'error';
      case TaskPriority.MEDIUM:
        return 'warning';
      case TaskPriority.LOW:
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'info';
      case TaskStatus.IN_PROGRESS:
        return 'warning';
      case TaskStatus.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  };
  
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  // Mobile view renders cards instead of a table
  const renderTaskCards = () => {
    if (filteredTasks.length === 0) {
      return (
        <Alert severity="info" sx={{ width: '100%' }}>
          No tasks found
        </Alert>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {task.description || 'No description'}
                  </Typography>
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={`Due: ${format(new Date(task.dueDate), 'dd-MM-yyyy')}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={task.status} 
                    color={getStatusColor(task.status) as any} 
                    size="small" 
                  />
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority) as any} 
                    size="small" 
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/task-form/${task.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Desktop view renders a table
  const renderTaskTable = () => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description || '-'}</TableCell>
                  <TableCell>{format(new Date(task.dueDate), 'dd-MM-yyyy')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      color={getPriorityColor(task.priority) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => navigate(`/task-form/${task.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: 2, 
          mb: 2 
        }}>
          <Typography variant="h5" component="h2">
            Tasks Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/task-form')}
            fullWidth={isMobile}
          >
            Add New Task
          </Button>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2, 
          mb: 3 
        }}>
          <FormControl size="small" sx={{ minWidth: 150, width: isMobile ? '100%' : 'auto' }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={TaskStatus.PENDING}>{TaskStatus.PENDING}</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>{TaskStatus.COMPLETED}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150, width: isMobile ? '100%' : 'auto' }}>
            <InputLabel>Priority Filter</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority Filter"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={TaskPriority.LOW}>{TaskPriority.LOW}</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>{TaskPriority.MEDIUM}</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>{TaskPriority.HIGH}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          isMobile ? renderTaskCards() : renderTaskTable()
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;