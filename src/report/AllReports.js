import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AllReports = () => {
  const handleTimeFrameChange = async (event) => {
    const timeFrame = event.target.value;
    downloadReport(timeFrame);
  };

  const downloadReport = async (timeFrame) => {
    try {
      const response = await axios.get(`http://localhost:4002/api/addtasks/tasks/summary/1706938771962djdxtyim3586406372`, {
        params: { timeFrame }
      });
      const projects = response.data;

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const filteredProjects = projects
        .map((project) => {
          const filteredUsers = project.users
            .map((user) => {
              const filteredTasks = user.tasks.filter((task) => {
                const taskDate = new Date(task.createAt);
                taskDate.setHours(0, 0, 0, 0);
                switch (timeFrame) {
                  case 'today':
                    return taskDate.getTime() === currentDate.getTime();
                  case '7days':
                    return currentDate.getTime() - taskDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                  case '30days':
                    return currentDate.getTime() - taskDate.getTime() < 30 * 24 * 60 * 60 * 1000;
                  default:
                    return true;
                }
              });
              return { ...user, tasks: filteredTasks };
            })
            .filter((user) => user.tasks.length > 0);
          return { ...project, users: filteredUsers };
        })
        .filter((project) => project.users.length > 0);

      let excelData = [];

      filteredProjects.forEach((project) => {
        excelData.push({
          'Project Name': project.projectName,
          Username: '',
          Field: '',
          Value: ''
        });

        project.users.forEach((user) => {
          excelData.push({
            'Project Name': '',
            Username: `${user.firstName} ${user.lastName}`,
            Field: '',
            Value: ''
          });

          user.tasks.forEach((task) => {
            Object.entries(task.formFields).forEach(([field, value]) => {
              let fieldValue = Array.isArray(value) ? value.join(', ') : value;
              excelData.push({
                'Project Name': '',
                Username: '',
                Field: field,
                Value: fieldValue
              });
            });
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = excelData.reduce((widths, row) => {
        Object.keys(row).forEach((key, index) => {
          const contentLength = row[key] ? row[key].toString().length : 0;
          widths[index] = Math.max(widths[index] || 10, contentLength);
        });
        return widths;
      }, []);

      ws['!cols'] = colWidths.map((w) => ({ wch: w + 2 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Projects Report');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      saveAs(data, 'ProjectsReport.xlsx');
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  };

  return (
    <div>
      <h2>Download Project Report</h2>
      <FormControl fullWidth>
        <InputLabel id="timeFrame-label">Select Time Frame</InputLabel>
        <Select labelId="timeFrame-label" id="timeFrame" onChange={handleTimeFrameChange} label="Select Time Frame" defaultValue="">
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="7days">Last 7 Days</MenuItem>
          <MenuItem value="30days">Last 30 Days</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default AllReports;
