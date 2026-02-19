import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '@care/shared';
import { useStyles } from './legalStyles';

export default function LegalPage() {
  const { pathname } = useLocation();
  const classes = useStyles();

  const isPrivacy = pathname === '/privacy';
  const content = isPrivacy ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  return (
    <div className={classes.root}>
      <Link className={classes.backLink} to="/login">
        &larr; Back
      </Link>
      <div className={classes.content}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
