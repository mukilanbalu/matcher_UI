// material-ui
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'flex-end' }}
        spacing={2}
        textAlign={{ xs: 'center', sm: 'inherit' }}
      >
        {/* <Typography variant="subtitle2" color="secondary">
          This site is protected by{' '}
          <Typography component={Link} variant="subtitle2" href="#mantis-privacy" target="_blank" underline="hover">
            Privacy Policy
          </Typography>
        </Typography> */}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} textAlign={{ xs: 'center', sm: 'inherit' }}>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            target="_blank"
            underline="hover"
          >
            &copy; <a href="http://marriagematcher.com/">Marriagematcher</a> <span id="copyrightYear">2024</span>

          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            target="_blank"
            underline="hover"
            href='/terms-and-conditions'
          >
            Terms and Conditions
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="/privacy-policy"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="/disclaimer"
            target="_blank"
            underline="hover"
          >
            Disclaimer
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
