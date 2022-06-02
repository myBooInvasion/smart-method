import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { SchoolRounded, PaidRounded, PeopleAltRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';
import {
  Line
} from 'react-chartjs-2';
ChartJS.register(...registerables);

const CustomFormControl = styled(FormControl)({
  '& .MuiFormLabel-root': {
    color: '#7d7e88',
    '&.Mui-focused': {
      color: '#379fff',
    }
  },
  '& .MuiOutlinedInput-root': {
    color: '#7d7e88',
    '&.Mui-focused, &.Mui-focused:hover fieldset': {
      color: '#379fff',
    },
    '& .MuiSelect-icon, &.Mui-disabled': {
      color: '#7d7e88',
    },
    '&:hover fieldset': {
      borderColor: '#7d7e88',
    }
  }
})

function ResultsComp() {
  const [project, setProject] = useState([]);
  const [result, setResult] = useState({
    bobot: [],
    alternatif: [],
    result: {},
    status: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/alternatif/results', {
      method: 'GET',
    })
      .then(result => result.json())
      .then(json => setProject(json))
      .catch(err => console.error(err));
  }, []);

  const clickProject = (event) => {
    fetch(`http://localhost:8000/alternatif/utilitas/${event.target.value}`, {
      method: 'GET',
    })
      .then(result => result.json())
      .then(json => setResult(Object.assign({}, json)))
      .catch(err => console.error(err));
  }

  return (
    <div className='container-sm my-3'>
      <div className='row mb-3'>
        <div className='col-6 col-sm-5 col-md-4 col-lg-3 text-start'>
          <CustomFormControl variant='outlined' fullWidth disabled={project.length === 0} required size='small'>
            <InputLabel id='select-project'>Pilih author</InputLabel>
            <Select
              idlabel='select-project'
              defaultValue=''
              label='Pilih author'
              onChange={clickProject}
            >
              {project.length !== 0 && project.map((item, index) => {
                return (
                  <MenuItem key={item.id} value={item.id}>{item.author}</MenuItem>
                );
              })}
            </Select>
          </CustomFormControl>
        </div>
      </div>
      <div className='row gy-3'>
        <div className='col-12 col-md-7 text-start'>
          <Box sx={{ backgroundColor: '#2b2c3e' }}>
            <Line data={{
              labels: (result.alternatif.length !== 0 ? result.alternatif.map(item => { return item.nama }) : ['None']),
              datasets: [
                {
                  data: result.result.rank,
                  borderColor: '#6568ec',
                  borderWidth: 1,
                  fill: true,
                  backgroundColor: 'RGBa(20, 57, 95, 0.4)',
                },
              ],
            }} options={{
              layout: {
                padding: 10,
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Hasil perankingan',
                  color: '#379fff',
                }
              },
              scales: {
                x: {
                  grid: {
                    color: '#474957',
                  },
                  ticks: {
                    color: '#4bcdbc',
                  }
                },
                y: {
                  grid: {
                    color: '#474957',
                  },
                  ticks: {
                    color: 'whitesmoke',
                  }
                }
              }
            }} />
          </Box>
        </div>
        <div className='col-12 col-md-5'>
          <Box sx={{ backgroundColor: '#2b2c3e', pt: 1 }}>
            <Typography variant='body1' color='white'>Normalisai Pembobotan</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolRounded sx={{color: 'white'}} />
                </ListItemIcon>
                <ListItemText primary='Indeks Prestasi Komulatif' secondary='Bobot: 40%'
                  primaryTypographyProps={{color: 'white'}}
                  secondaryTypographyProps={{color: '#379fff'}} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PaidRounded sx={{color: 'white'}} />
                </ListItemIcon>
                <ListItemText primary='Pendapatan orangtua' secondary='Bobot: 30%'
                  primaryTypographyProps={{color: 'white'}}
                  secondaryTypographyProps={{color: '#379fff'}} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PeopleAltRounded sx={{color: 'white'}} />
                </ListItemIcon>
                <ListItemText primary='Jumlah tanggungan' secondary='Bobot: 30%'
                  primaryTypographyProps={{color: 'white'}}
                  secondaryTypographyProps={{color: '#379fff'}} />
              </ListItem>
            </List>
          </Box>
        </div>
        <div className='col'>
          <Box sx={{ backgroundColor: '#2b2c3e', maxHeight: '50vh' }} className='table-responsive'>
            <table className='table text-white'>
              <thead>
                <tr>
                  {Object.keys(result.result).length !==0? Object.keys(result.result).map((key, index) => {
                    return (
                      <th key={index}>{key}</th>
                    );
                  }): <th>Tolong pilih author untuk menampilkan hasil...</th>}
                </tr>
              </thead>
              <tbody>
                {result.alternatif.length !== 0 && result.alternatif.map((item, id) => {
                  return (
                    <tr key={id}>
                      {Object.values(result.result).map((child, index) => {
                        return (
                          <td key={index}>{child[id]}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default ResultsComp;