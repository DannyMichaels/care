import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Styles and Assets
import { useStyles } from './homeStyles.js';
import RXGuideLogo from '../../../components/MedComponents/RXGuideLogo';

// Components
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp';
import LinearProgressLoading from '../../../components/Loading/LinearProgressLoading.jsx';

// Containers and Views
import Layout from '../../../layouts/Layout/Layout';
import MoodsContainer from '../../../containers/MoodsContainer';
import AffirmationsContainer from '../../../containers/AffirmationsContainer';
import SymptomsContainer from '../../../containers/SymptomsContainer';
import MedsContainer from '../../../containers/MedsContainer';
import FoodsContainer from '../../../containers/FoodsContainer';
import NotFound from '../../Error/NotFound';

// Context
import { CurrentUserContext } from '../../../context/CurrentUserContext';
import { DateContext } from '../../../context/DateContext';

// Services and Utilities
import { getAllAffirmations, checkValidity, filterByDate } from '@care/shared';
import ScrollToTopOnMount from '../../../components/Helpers/ScrollToTopOnMount';
import DateCarousel from '../../../components/DateCarousel/DateCarousel';
import NotificationBanner from '../../../components/NotificationBanner/NotificationBanner';

export default function Home() {
  const [{ currentUser }] = useContext(CurrentUserContext);
  const { selectedDate } = useContext(DateContext);
  const [affirmations, setAffirmations] = useState([]);
  const [loadedAffirmation, setLoadedAffirmation] = useState(false);
  const [moodCount, setMoodCount] = useState(0);
  const [symptomCount, setSymptomCount] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const [medCount, setMedCount] = useState(0);
  let location = useLocation();

  const [sections, setSections] = useState({
    mood: { createOpen: false, optionsOpen: false },
    affirmation: { createOpen: false, optionsOpen: false },
    symptom: { createOpen: false, optionsOpen: false },
    food: { createOpen: false, optionsOpen: false },
    med: { createOpen: false, optionsOpen: false },
  });

  const toggleCreate = (key) => setSections((prev) => ({
    ...prev,
    [key]: { ...prev[key], createOpen: !prev[key].createOpen },
  }));

  const closeCreate = (key) => setSections((prev) => ({
    ...prev,
    [key]: { ...prev[key], createOpen: false },
  }));

  const toggleOptions = (key) => setSections((prev) => ({
    ...prev,
    [key]: { ...prev[key], optionsOpen: !prev[key].optionsOpen },
  }));

  useEffect(() => {
    const fetchAffirmations = async () => {
      if (!currentUser?.email_verified) return;

      const affirmationData = await getAllAffirmations();
      setAffirmations(affirmationData);
      setLoadedAffirmation(true);
    };
    fetchAffirmations();
  }, [currentUser]);

  const classes = useStyles();
  const filteredAffirmations = useMemo(
    () => filterByDate(affirmations, selectedDate, 'affirmation_date'),
    [affirmations, selectedDate]
  );

  const handleMoodCount = useCallback((c) => setMoodCount(c), []);
  const handleSymptomCount = useCallback((c) => setSymptomCount(c), []);
  const handleFoodCount = useCallback((c) => setFoodCount(c), []);
  const handleMedCount = useCallback((c) => setMedCount(c), []);

  if (!loadedAffirmation) {
    return <LinearProgressLoading />;
  }

  return checkValidity(location.pathname) ? (
    <Layout title="Home">
      <div className={classes.root}>
        <ScrollToTopOnMount />
        <DateCarousel />
        <NotificationBanner />
        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={moodCount} color="primary" showZero={false} overlap="rectangular">
              <Typography className={classes.heading}>Mood</Typography>
            </Badge>
            <div className={classes.summaryActions} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Options">
                <IconButton className={classes.actionIcon} onClick={() => toggleOptions('mood')}>
                  <SettingsSharpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton className={classes.actionIcon} onClick={() => toggleCreate('mood')}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.contentContainer}>
              <MoodsContainer
                onFilteredCount={handleMoodCount}
                createOpen={sections.mood.createOpen}
                onCloseCreate={() => closeCreate('mood')}
                optionsOpen={sections.mood.optionsOpen}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge
              badgeContent={filteredAffirmations.length}
              color="primary"
              showZero={false}
              overlap="rectangular"
            >
              <Typography className={classes.heading}>
                {filteredAffirmations.length === 1
                  ? 'Affirmation'
                  : 'Affirmations'}
              </Typography>
            </Badge>
            <div className={classes.summaryActions} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Options">
                <IconButton className={classes.actionIcon} onClick={() => toggleOptions('affirmation')}>
                  <SettingsSharpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton className={classes.actionIcon} onClick={() => toggleCreate('affirmation')}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.contentContainer}>
              <AffirmationsContainer
                affirmations={filteredAffirmations}
                loadedAffirmation={loadedAffirmation}
                setAffirmations={setAffirmations}
                createOpen={sections.affirmation.createOpen}
                onCloseCreate={() => closeCreate('affirmation')}
                optionsOpen={sections.affirmation.optionsOpen}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge
              badgeContent={symptomCount}
              color="primary"
              showZero={false}
              overlap="rectangular"
            >
              <Typography className={classes.heading}>Symptoms</Typography>
            </Badge>
            <div className={classes.summaryActions} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Options">
                <IconButton className={classes.actionIcon} onClick={() => toggleOptions('symptom')}>
                  <SettingsSharpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton className={classes.actionIcon} onClick={() => toggleCreate('symptom')}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.contentContainer}>
              <SymptomsContainer
                onFilteredCount={handleSymptomCount}
                createOpen={sections.symptom.createOpen}
                onCloseCreate={() => closeCreate('symptom')}
                optionsOpen={sections.symptom.optionsOpen}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={foodCount} color="primary" showZero={false} overlap="rectangular">
              <Typography className={classes.heading}>Food diary</Typography>
            </Badge>
            <div className={classes.summaryActions} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Options">
                <IconButton className={classes.actionIcon} onClick={() => toggleOptions('food')}>
                  <SettingsSharpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton className={classes.actionIcon} onClick={() => toggleCreate('food')}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.contentContainer}>
              <FoodsContainer
                onFilteredCount={handleFoodCount}
                createOpen={sections.food.createOpen}
                onCloseCreate={() => closeCreate('food')}
                optionsOpen={sections.food.optionsOpen}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={medCount} color="primary" showZero={false} overlap="rectangular">
              <RXGuideLogo />
            </Badge>
            <div className={classes.summaryActions} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Options">
                <IconButton className={classes.actionIcon} onClick={() => toggleOptions('med')}>
                  <SettingsSharpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton className={classes.actionIcon} onClick={() => toggleCreate('med')}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.contentContainer}>
              <MedsContainer
                onFilteredCount={handleMedCount}
                createOpen={sections.med.createOpen}
                onCloseCreate={() => closeCreate('med')}
                optionsOpen={sections.med.optionsOpen}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </Layout>
  ) : (
    <NotFound />
  );
}
