import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addTask } from '../../api/taskApi';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Task } from '../../pages/Dashboard';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onTaskAdded }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'To Do' as const,
      priority: 'Low' as const,
      assignedTo: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      assignedTo: Yup.string().required('Assignee is required'),
    }),
    onSubmit: async (values) => {
      if (!accessToken) return;
      try {
        const newTask = await addTask(values, accessToken);
        onTaskAdded(newTask);
        onClose();
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Typography variant="h6" mb={2}>
          Add New Task
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formik.values.status} onChange={formik.handleChange}>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formik.values.priority} onChange={formik.handleChange}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Assigned To"
            name="assignedTo"
            value={formik.values.assignedTo}
            onChange={formik.handleChange}
            error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}
            helperText={formik.touched.assignedTo && formik.errors.assignedTo}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Add Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskModal;