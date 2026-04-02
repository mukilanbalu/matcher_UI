// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 320 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 1, color: 'primary.main' }}>
              <SearchOutlined />
            </InputAdornment>
          }
          sx={{
            borderRadius: '20px',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(166, 98, 124, 0.2)',
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid #A6627C'
            },
            '&.Mui-focused': {
               bgcolor: '#fff',
               boxShadow: '0 4px 15px rgba(166, 98, 124, 0.15)'
            }
          }}
          placeholder="Search for partners..."
        />
      </FormControl>
    </Box>
  );
}
