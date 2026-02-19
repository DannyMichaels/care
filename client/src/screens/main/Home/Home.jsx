import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

// Styles and Assets
import { useStyles } from "./homeStyles.js";
import RXGuideLogo from "../../../components/MedComponents/RXGuideLogo";

// Components
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LinearProgressLoading from "../../../components/Loading/LinearProgressLoading.jsx";

// Containers and Views
import Layout from "../../../layouts/Layout/Layout";
import MoodsContainer from "../../../containers/MoodsContainer";
import AffirmationsContainer from "../../../containers/AffirmationsContainer";
import SymptomsContainer from "../../../containers/SymptomsContainer";
import MedsContainer from "../../../containers/MedsContainer";
import FoodsContainer from "../../../containers/FoodsContainer";
import NotFound from "../../Error/NotFound";

// Context
import { CurrentUserContext } from "../../../context/CurrentUserContext";
import { DateContext } from "../../../context/DateContext";

// Services and Utilities
import { getAllAffirmations, checkValidity, filterByDate } from '@care/shared';
import ScrollToTopOnMount from "../../../components/Helpers/ScrollToTopOnMount";
import DateCarousel from "../../../components/DateCarousel/DateCarousel";
import NotificationBanner from "../../../components/NotificationBanner/NotificationBanner";

export default function Home() {
  const [{ currentUser }] = useContext(CurrentUserContext);
  const { selectedDate, showAllDates } = useContext(DateContext);
  const [affirmations, setAffirmations] = useState([]);
  const [loadedAffirmation, setLoadedAffirmation] = useState(false);
  const [moodCount, setMoodCount] = useState(0);
  const [symptomCount, setSymptomCount] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const [medCount, setMedCount] = useState(0);
  let location = useLocation();

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
    () => filterByDate(affirmations, selectedDate, showAllDates, "affirmation_date"),
    [affirmations, selectedDate, showAllDates]
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
          </AccordionSummary>
          <AccordionDetails>
            <div className="content-container">
              <MoodsContainer onFilteredCount={handleMoodCount} />
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
                  ? "Affirmation"
                  : "Affirmations"}
              </Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="content-container">
              <AffirmationsContainer
                affirmations={filteredAffirmations}
                loadedAffirmation={loadedAffirmation}
                setAffirmations={setAffirmations}
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
          </AccordionSummary>
          <AccordionDetails>
            <div className="content-container">
              <SymptomsContainer onFilteredCount={handleSymptomCount} />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={foodCount} color="primary" showZero={false} overlap="rectangular">
              <Typography className={classes.heading}>Food diary</Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="content-container">
              <FoodsContainer onFilteredCount={handleFoodCount} />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={medCount} color="primary" showZero={false} overlap="rectangular">
              <RXGuideLogo />
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <div className="content-container">
              <MedsContainer onFilteredCount={handleMedCount} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </Layout>
  ) : (
    <NotFound />
  );
}
