import React, { useState, useEffect } from 'react';
import axiosInstance from 'config/AxiosInstanceAdmin';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Container
} from '@mui/material';
import { DeleteOutline, AddCircleOutline } from '@mui/icons-material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import { toast, ToastContainer } from 'react-toastify';

const EditForm = () => {
  const { FromId } = useParams();
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    projectName: '', // Add this line to initialize projectName
    formName: '',
    fields: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axiosInstance.get(`/addreportingfrom/${FromId}`);
        setFormDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching form details:', error);
        // Handle error
      }
    };

    fetchFormDetails();
  }, [FromId]);
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setFormDetails((prevDetails) => {
      const updatedFields = [...prevDetails.fields];

      if (name === 'options') {
        // Special handling for options
        updatedFields[index][name] = value.split(',').map((option) => option.trim());
      } else if (name === 'dateValue') {
        // Special handling for dateValue
        updatedFields[index][name] = value;
      } else {
        // Handle other fields normally
        if (index === -1) {
          // Handling formName separately
          return {
            ...prevDetails,
            [name]: value
          };
        }

        updatedFields[index][name] = value;
      }

      return {
        ...prevDetails,
        fields: updatedFields
      };
    });
  };

  const handleRemoveField = (index) => {
    setFormDetails((prevDetails) => {
      const updatedFields = [...prevDetails.fields];
      updatedFields.splice(index, 1);
      return {
        ...prevDetails,
        fields: updatedFields
      };
    });
  };

  const handleAddField = () => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      fields: [...prevDetails.fields, { fieldName: '', fieldType: 'text' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/addreportingfrom/${FromId}`, formDetails);
      toast.success('Form update successfully');
      navigate(`/admin/addform`);
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Error updating form');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px', padding: '10px' }}
          >
            Edit Form
          </Typography>
          <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField disabled label="Project Name" variant="outlined" fullWidth name="projectName" value={formDetails.projectName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Form Name"
                  variant="outlined"
                  fullWidth
                  name="formName"
                  value={formDetails.formName}
                  onChange={(e) => handleChange(e, -1)}
                />
              </Grid>
              {formDetails.fields.map((field, index) => (
                <Grid container spacing={2} key={index} style={{ marginTop: '10px', marginLeft: '10px' }}>
                  <Grid item xs={12} sm={4} md={3}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor={`fieldType-${index}`}>Field Type</InputLabel>
                      <Select
                        id={`fieldType-${index}`}
                        label="Field Type"
                        name="fieldType"
                        value={field.fieldType}
                        onChange={(e) => handleChange(e, index)}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="checkbox">Checkbox</MenuItem>
                        <MenuItem value="radio">Radio</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={10} md={8}>
                    <TextField
                      label="Field Name"
                      variant="outlined"
                      fullWidth
                      name="fieldName"
                      value={field.fieldName}
                      onChange={(e) => handleChange(e, index)}
                      style={{ marginBottom: '10px' }}
                    />
                    {field.fieldType === 'checkbox' && (
                      <TextField
                        label="Options (comma-separated)"
                        variant="outlined"
                        fullWidth
                        name="options"
                        value={field.options ? field.options.join(',') : ''}
                        onChange={(e) => handleChange(e, index)}
                        style={{ marginTop: '5px' }}
                      />
                    )}
                    {field.fieldType === 'radio' && (
                      <TextField
                        label="Options (comma-separated)"
                        variant="outlined"
                        fullWidth
                        name="options"
                        value={field.options ? field.options.join(',') : ''}
                        onChange={(e) => handleChange(e, index)}
                        style={{ marginTop: '5px' }}
                      />
                    )}
                    {field.fieldType === 'date' && (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Select Date"
                          inputFormat="MM/dd/yyyy"
                          value={field.dateValue || null}
                          onChange={(newValue) => handleChange({ target: { name: 'dateValue', value: newValue } }, index)}
                          renderInput={(params) => <TextField {...params} variant="outlined" fullWidth style={{ marginBottom: '10px' }} />}
                        />
                      </LocalizationProvider>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={1}>
                    <Tooltip title="Remove Field">
                      <IconButton onClick={() => handleRemoveField(index)} color="error">
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                type="button"
                variant="outlined"
                style={{
                  color: 'rgba(71, 121, 126, 1)',
                  borderColor: 'rgba(71, 121, 126, 1)',
                  borderRadius: '5px'
                }}
                onClick={handleAddField}
                startIcon={<AddCircleOutline />}
              >
                Add Field
              </Button>

              <Button type="submit" variant="contained" style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}>
                Update Form
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
      <ToastContainer />
    </>
  );
};

export default EditForm;
