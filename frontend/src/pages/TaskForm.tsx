import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { RootState } from '../store';
import { addTask, updateTaskInList, setError, setLoading } from '../features/tasks/tasksSlice';
import { createTask, fetchTaskById, updateTask } from '../features/tasks/tasksApi';
import { TaskStatus, TaskPriority } from '../features/tasks/types';

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.tasks);
  const [loadingTask, setLoadingTask] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required').max(100, 'Title cannot exceed 100 characters'),
      description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
      dueDate: Yup.date().required('Due date is required'),
      status: Yup.string().required('Status is required'),
      priority: Yup.string().required('Priority is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setFormError(null);
        dispatch(setLoading(true));
        
        console.log('Submitting task:', isEditMode ? 'update' : 'create', values);

        if (isEditMode && id) {
          const updatedTask = await updateTask(parseInt(id), values);
          console.log('Task updated successfully:', updatedTask);
          dispatch(updateTaskInList(updatedTask));
        } else {
          const newTask = await createTask(values);
          console.log('Task created successfully:', newTask);
          dispatch(addTask(newTask));
        }

        navigate('/dashboard');
      } catch (err: any) {
        console.error('Task submission error:', err);
        const errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} task`;
        setFormError(errorMessage);
        dispatch(setError(errorMessage));
      } finally {
        setSubmitting(false);
        dispatch(setLoading(false));
      }
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode && id) {
        try {
          setLoadingTask(true);
          const task = await fetchTaskById(parseInt(id));
          console.log('Fetched task for editing:', task);
          formik.setValues({
            title: task.title,
            description: task.description || '',
            dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
            status: task.status,
            priority: task.priority,
          });
        } catch (err) {
          console.error('Error fetching task:', err);
          setFormError('Failed to fetch task details');
        } finally {
          setLoadingTask(false);
        }
      }
    };

    fetchTask();
  }, [id, isEditMode]);

  if (loadingTask) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading task...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </Typography>

        {(formError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="dueDate"
                name="dueDate"
                label="Due Date"
                type="date"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                helperText={formik.touched.dueDate && formik.errors.dueDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  label="Status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={TaskStatus.PENDING}>{TaskStatus.PENDING}</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>{TaskStatus.COMPLETED}</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formik.values.priority}
                  label="Priority"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={TaskPriority.LOW}>{TaskPriority.LOW}</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>{TaskPriority.MEDIUM}</MenuItem>
                  <MenuItem value={TaskPriority.HIGH}>{TaskPriority.HIGH}</MenuItem>
                </Select>
                {formik.touched.priority && formik.errors.priority && (
                  <FormHelperText>{formik.errors.priority}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formik.isSubmitting || loading}
                >
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskForm;