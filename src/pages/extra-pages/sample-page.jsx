// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <MainCard title="404" align='center' variant="h1">
      <Typography variant="h3" align='center'>
        oops! page not found!
      </Typography>
    </MainCard>
  );
}
