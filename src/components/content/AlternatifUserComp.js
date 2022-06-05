import React, { useState } from 'react';
import {
  Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  AddCircleOutlineRounded, DeleteOutlineRounded, BookmarkAddedOutlined, DataObjectRounded
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: '#474957',
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInputBase-root': {
    '& input': {
      color: '#474957',
    },
    '&.Mui-focused input': {
      color: '#ffffff',
    },
    '&.Mui-focused fieldset, &:hover fieldset': {
      borderColor: '#ffffff',
    },
    '&:hover:before': {
      borderBottom: '2px solid #474957',
    },
    '&::before': {
      borderBottom: '1px solid #474957',
    },
    '&::after': {
      borderBottom: '2px solid #ffffff',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#474957',
  }
})
const CustomFormControl = styled(FormControl)({
  '& .MuiInputLabel-root': {
    color: '#474957',
  },
  '& .MuiInputBase-root': {
    '& .MuiSelect-select': {
      color: '#474957',
    }
  }
})
const CustomDisableButton = styled(Button)({
  backgroundColor: '#3e3c3f',
  color: '#efd34a',
  '&.Mui-disabled': {
    backgroundColor: '#2a3851',
    color: '#347fc9',
  }
})
const CustomLoadingButton = styled(LoadingButton)({
  '&.Mui-disabled': {
    backgroundColor: '#2a3851',
    color: '#347fc9',
  }
})

function AlternatifUserComp() {
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState({
    ipk: false,
    gaji: false,
  });
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState({});
  const [author, setAuthor] = useState('');
  const [alternatif, setAlternatif] = useState([]);
  const [dataSiswa, setDataSiswa] = useState({
    nama: '',
    nim: '',
    ipk: 2.5,
    gaji: '',
    tanggungan: '',
  });

  const changeHandler = (property, value, action) => {
    if (property === 'ipk') {
      if (value < 2.5 || value > 4) {
        setFailed({...failed, ipk: true});
      } else if (isNaN(value)) {
        setFailed({...failed, ipk: true});
        value = ''
      } else {
        setFailed({...failed, ipk: false});
      }
    } else if (property === 'gaji') {
      if (value <= 0 || value > 5000000) {
        setFailed({...failed, gaji: true});
      } else if (isNaN(value)) {
        setFailed({...failed, gaji: true});
        value = ''
      } else {
        setFailed({...failed, gaji: false});
      }
    }
    switch (action.type) {
      case 'BASIC_FORM':
        return setDataSiswa({ ...dataSiswa, [property]: value });

      case 'MODAL_FORM':
        return setModalText({ ...modalText, [property]: value });

      default:
        break;
    }
  }
  const addHandler = () => {
    if (Object.values(dataSiswa).includes((''))) {
      toast.warning('Data tidak lengkap', {
        position: 'top-center',
        autoClose: 1500,
        closeButton: false,
      });
    } else if (failed.ipk || failed.gaji) {
      toast.warning('Periksa inputan anda kembali', {
        position: 'top-center',
        autoClose: 1500,
        closeButton: false,
      });
    } else {
      setAlternatif([...alternatif, dataSiswa]);
    }
  }
  const deleteHandler = id => {
    setAlternatif(alternatif.filter((item, index) => {
      return item !== alternatif[id];
    }));
  }
  const clearHandler = () => {
    setAlternatif(alternatif.splice(0, 0));
    setDataSiswa(Object.assign(dataSiswa, {
      nama: '',
      nim: '',
      ipk: 2.5,
      gaji: '',
      tanggungan: '',
    }));
  }
  const editModal = index => {
    setModalText(Object.assign({}, alternatif[index]));
    setId(index);
    setModal(!modal);
  }
  const saveModal = index => {
    if (failed.ipk || failed.gaji) {
      toast.warning('Periksa inputan anda kembali', {
        position: 'top-center',
        autoClose: 1500,
        closeButton: false,
      });
    } else {
      alternatif[index] = modalText;
      setModal(!modal);
    }
  }
  const saveData = () => {
    if (author === '') {
      toast.warning('Nama author kosong', {
        position: 'top-center',
        autoClose: 1500,
        closeButton: false,
      })
    } else {
      fetch('http://localhost:8000/alternatif/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: author.toLocaleLowerCase(), alternatif: alternatif })
      })
        .then(result => {
          if (result.status === 201) {
            toast.success('Data tersimpan', {
              position: 'top-center',
              autoClose: 1500,
              closeButton: false,
            });
            return result.json()
          } else {
            toast.error('Gagal menyimpan', {
              position: 'top-center',
              autoClose: 1500,
              closeButton: false,
            });
          }
        })
        .then(json => console.log('success'))
        .catch(err => console.error(err))
    }
  }
  const generateData = (range) => {
    let store = []
    setLoading(true);
    for (let item = 0; item < range; item++) {
      store.push({
        nim: '101910' + (item + 1),
        nama: 'A'.concat(item + 1),
        ipk: (function () {
          let ipkValue = (Math.random() * 4).toFixed(2);
          if (ipkValue < 2.5) {
            ipkValue = 2.5;
          }
          return parseFloat(ipkValue);
        })(),
        gaji: Math.round(Math.random() * 5000000),
        tanggungan: (function () {
          let tanggunganValue = Math.round(Math.random() * 4);
          if (tanggunganValue === 0) {
            tanggunganValue += 1;
          }
          return tanggunganValue;
        })(),
      });
    }
    setAlternatif(store);
    setLoading(false);
  }

  return (
    <div className='container-sm my-3'>
      <div className='row mb-4 align-items-center'>
        <div className='col-6 col-sm-auto text-start'>
          <CustomTextField variant='outlined' size='small' label='Nama author' autoFocus
            value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div className='col-6 col-sm text-start'>
          <CustomLoadingButton variant='contained' sx={{ textTransform: 'capitalize' }} loading={loading}
            onClick={() => generateData(100)} startIcon={<DataObjectRounded />} loadingPosition='start'>
            Random data
          </CustomLoadingButton>
        </div>
      </div>
      <div className='row gy-3 pb-3 rounded' style={{ backgroundColor: '#2b2c3e' }}>
        <div className='col-12 mt-0'>
          <div className='row align-items-center rounded-top py-2' style={{ backgroundColor: '#379fff' }}>
            <div className='col'>
              <Typography variant='subtitle1' color='white' textAlign={{ xs: 'center', sm: 'left' }}>Masukan data alternatif</Typography>
            </div>
            <div className='col-12 col-sm-4 col-lg-3'>
              <Stack direction='row' spacing={2} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                <Button startIcon={<AddCircleOutlineRounded />} sx={{ color: 'white', textTransform: 'capitalize' }}
                  onClick={addHandler}>
                  Add
                </Button>
                <Button disabled={alternatif.length === 0} startIcon={<DeleteOutlineRounded />} sx={{ color: 'white', textTransform: 'capitalize' }}
                  onClick={clearHandler}>
                  Clear
                </Button>
              </Stack>
            </div>
          </div>
        </div>

        <div className='col-12'>
          <FormAlternatif value={dataSiswa} change={changeHandler} error={failed} />
        </div>
      </div>

      <div className='row gy-3 my-3 pb-3' style={{ backgroundColor: '#2b2c3e' }}>
        <div className='col-12 text-start table-responsive' style={{ maxHeight: '50vh' }}>
          <table className='table text-white'>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIM</th>
                <th>IPK</th>
                <th>Gaji</th>
                <th>Tanggungan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alternatif.length !== 0 ? alternatif.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.nama}</th>
                    <td>{item.nim}</td>
                    <td>{item.ipk}</td>
                    <td>{item.gaji}</td>
                    <td>{item.tanggungan}</td>
                    <td>
                      <Stack direction='row' spacing={1}>
                        <Button onClick={() => editModal(index)} color='primary'>edit</Button>
                        <Button onClick={() => deleteHandler(index)} color='warning'>delete</Button>
                      </Stack>
                    </td>
                  </tr>
                );
              }) : <tr className='text-center'><td colSpan={6}>--------------- <i>Belum ada data</i> ---------------</td></tr>}
            </tbody>
          </table>
        </div>
        <div className='col text-md-start'>
          <CustomDisableButton variant='contained' color='success' startIcon={<BookmarkAddedOutlined />} sx={{ textTransform: 'lowercase' }}
            disabled={alternatif.length === 0}
            onClick={saveData}>
            save
          </CustomDisableButton>
        </div>
      </div>
      <ModalAlternatif value={modalText} open={modal} close={setModal} modalIndex={id} change={changeHandler} save={saveModal} error={failed} />
    </div>
  );
}

export default AlternatifUserComp;

function FormAlternatif(props) {
  return (
    <div className='row gy-2 align-items-center'>
      <div className='col-12 col-sm-6 col-lg-5 col-xl-3'>
        <CustomTextField required label='Nama' fullWidth size='small' variant='standard' autoComplete='off'
          value={props.value.nama}
          onChange={e => props.change('nama', e.target.value, { type: 'BASIC_FORM' })} />
      </div>
      <div className='col-8 col-sm-6 col-lg-4 col-xl-3'>
        <CustomTextField required type='number' label='NIM' fullWidth color='primary' size='small' variant='standard'
          value={props.value.nim}
          onChange={e => props.change('nim', e.target.value, { type: 'BASIC_FORM' })} />
      </div>
      <div className='col-4 col-sm-2 col-lg-3 col-xl'>
        <CustomTextField required type='number' label='IPK' fullWidth color='primary' size='small' variant='standard'
          value={props.value.ipk} inputProps={{min: 2.5, max: 4, step: 0.1}} error={props.error.ipk}
          onChange={e => props.change('ipk', parseFloat(e.target.value), { type: 'BASIC_FORM' })} />
      </div>
      <div className='col-6 col-sm-6 col-lg-5 col-xl-2'>
        <CustomTextField required type='number' label='Gaji orangtua' fullWidth color='primary' size='small' variant='standard'
          value={props.value.gaji} inputProps={{min: 0, step: 1000}} error={props.error.gaji}
          onChange={e => props.change('gaji', e.target.value, { type: 'BASIC_FORM' })} />
      </div>
      <div className='col-6 col-sm-4 col-lg-4 col-xl-2 text-start'>
        <CustomFormControl variant='standard' required fullWidth size='small'>
          <InputLabel id='select-tanggungan'>Tanggungan</InputLabel>
          <Select
            idlabel='select-tanggungan'
            defaultValue=''
            label='Tanggungan'
            onChange={e => props.change('tanggungan', e.target.value, { type: 'BASIC_FORM' })}
          >
            <MenuItem value={1}>1 orang</MenuItem>
            <MenuItem value={2}>2 orang</MenuItem>
            <MenuItem value={3}>3 orang</MenuItem>
            <MenuItem value={4}>4 orang</MenuItem>
            <MenuItem value={5}>5 orang</MenuItem>
          </Select>
        </CustomFormControl>
      </div>
    </div>
  );
}

function ModalAlternatif(props) {
  return (
    <Dialog open={props.open} onClose={() => { props.close(!props.open) }} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Edit data</DialogTitle>
      <DialogContent>
        <DialogContentText>Lengkapi data dibawah ini :</DialogContentText>
        <Stack direction='column' spacing={2}>
          <TextField label='Nama' variant='standard' color='primary' size='small' fullWidth
            value={props.value.nama}
            onChange={e => props.change('nama', e.target.value, { type: 'MODAL_FORM' })} />
          <TextField type='number' label='NIM' variant='standard' color='primary' size='small' fullWidth
            value={props.value.nim}
            onChange={e => props.change('nim', e.target.value, { type: 'MODAL_FORM' })} />
          <TextField type='number' label='IPK' variant='standard' color='primary' size='small' fullWidth
            value={props.value.ipk} inputProps={{min: 2.5, max: 4, step: 0.1}} error={props.error.ipk}
            onChange={e => props.change('ipk', e.target.value, { type: 'MODAL_FORM' })} />
          <TextField type='number' label='Gaji orangtua' variant='standard' color='primary' size='small' fullWidth
            value={props.value.gaji} inputProps={{min: 0, step: 1000}} error={props.error.gaji}
            onChange={e => props.change('gaji', e.target.value, { type: 'MODAL_FORM' })} />
          <FormControl variant='standard' required fullWidth size='small'>
            <InputLabel id='select-tanggungan'>Tanggungan</InputLabel>
            <Select
              idlabel='select-tanggungan'
              label='Tanggungan'
              value={props.value.tanggungan}
              onChange={e => props.change('tanggungan', e.target.value, { type: 'MODAL_FORM' })}
            >
              <MenuItem value={1}>1 orang</MenuItem>
              <MenuItem value={2}>2 orang</MenuItem>
              <MenuItem value={3}>3 orang</MenuItem>
              <MenuItem value={4}>4 orang</MenuItem>
              <MenuItem value={5}>5 orang</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color='primary' variant='contained' size='small' sx={{ textTransform: 'lowercase' }}
          onClick={() => props.save(props.modalIndex)}>
          simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}