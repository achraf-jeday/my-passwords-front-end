import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={process.env.REACT_APP_BASE_URL}>
        Password Locker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
