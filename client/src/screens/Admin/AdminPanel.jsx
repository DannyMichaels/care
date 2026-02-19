import {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MuiLink from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../../layouts/Layout/Layout';
import {getAllReports, updateReport, removeReportedInsight, unhideReportedInsight} from '@care/shared';

const statusColors = {
  pending: { backgroundColor: '#fff3e0', color: '#e65100' },
  reviewed: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  dismissed: { backgroundColor: '#efebe9', color: '#5d4037' },
};

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReports(statusFilter || undefined);
      setReports(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleDismiss = async (id) => {
    await updateReport(id, 'dismissed');
    fetchReports();
  };

  const handleUndismiss = async (id) => {
    await updateReport(id, 'pending');
    fetchReports();
  };

  const handleHide = async (id) => {
    await removeReportedInsight(id);
    fetchReports();
  };

  const handleUnhide = async (id) => {
    await unhideReportedInsight(id);
    fetchReports();
  };

  return (
    <Layout title="Admin Panel">
      <Container maxWidth="xl">
        <Typography variant="h5" style={{marginBottom: 16}}>
          Content Reports
        </Typography>
        <FormControl variant="outlined" size="small" style={{minWidth: 160, marginBottom: 16}}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="dismissed">Dismissed</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: 48}}>
            <CircularProgress />
          </div>
        ) : reports.length === 0 ? (
          <Typography style={{opacity: 0.6, padding: 24}}>No reports found</Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Insight</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Report Status</TableCell>
                  <TableCell>Insight Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>
                      {report.insight ? (
                        <MuiLink
                          component="button"
                          variant="body2"
                          onClick={() => setSelectedInsight(report.insight)}>
                          {report.insight.title}
                        </MuiLink>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {report.insight?.user ? (
                        <MuiLink component={RouterLink} to={`/users/${report.insight.user.id}`}>
                          {report.insight.user.name}
                        </MuiLink>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {report.user ? (
                        <MuiLink component={RouterLink} to={`/users/${report.user.id}`}>
                          {report.user.name}
                        </MuiLink>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        size="small"
                        style={statusColors[report.status] || {}}
                      />
                    </TableCell>
                    <TableCell>
                      {report.insight ? (
                        <Chip
                          label={report.insight.status}
                          size="small"
                          style={report.insight.status === 'hidden'
                            ? { backgroundColor: '#ffebee', color: '#c62828' }
                            : { backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        />
                      ) : '—'}
                    </TableCell>
                    <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div style={{display: 'flex', gap: 8}}>
                        {report.status === 'pending' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleDismiss(report.id)}>
                              Dismiss
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              onClick={() => handleHide(report.id)}>
                              Hide Insight
                            </Button>
                          </>
                        )}
                        {report.status === 'reviewed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUnhide(report.id)}>
                            Unhide Insight
                          </Button>
                        )}
                        {report.status === 'dismissed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUndismiss(report.id)}>
                            Reopen
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Dialog open={!!selectedInsight} onClose={() => setSelectedInsight(null)} fullWidth maxWidth="sm">
          <DialogTitle>{selectedInsight?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" style={{opacity: 0.6, marginBottom: 8}}>
              by {selectedInsight?.user?.name} | Status: {selectedInsight?.status}
            </Typography>
            <Typography variant="body2" style={{marginBottom: 12}}>
              {selectedInsight?.description}
            </Typography>
            <Typography variant="body1">
              {selectedInsight?.body}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedInsight(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
