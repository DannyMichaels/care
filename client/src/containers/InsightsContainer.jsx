import { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { destroyInsight, getAllInsights, postInsight, putInsight, getOneInsight } from '@care/shared';
import Insights from "../screens/main/Insights/Insights";
import InsightCreate from "../screens/InsightScreens/InsightCreate/InsightCreate";
import InsightEdit from "../screens/InsightScreens/InsightEdit/InsightEdit";
import InsightDetail from "../screens/InsightScreens/InsightDetail/InsightDetail";

export default function InsightsContainer() {
  const [insights, setInsights] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [moderationError, setModerationError] = useState(null);
  const history = useHistory();

  const handleDelete = async (id) => {
    await destroyInsight(id);
    setInsights((prevState) =>
      prevState.filter((insight) => insight.id !== id)
    );
    history.push("/insights");
  };

  const onDelete = (id) => {
    handleDelete(id);
    setOpenDelete(false);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const fetchInsights = async () => {
    const insightData = await getAllInsights();
    setInsights(insightData);
    setLoaded(true);
    if (!initialLoaded) {
      setInitialLoaded(true)
    }
  };

  useEffect(() => {
    if (!loaded) {
      fetchInsights();
    }
  }, [loaded]);

  const handleCreate = async (insightData) => {
    try {
      setModerationError(null);
      const newInsight = await postInsight(insightData);
      setInsights((prevState) => [newInsight, ...prevState]);
      history.push("/insights");
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg) {
        setModerationError(msg);
      }
    }
  };

  const handleUpdate = async (id, insightData) => {
    try {
      setModerationError(null);
      const updatedInsight = await putInsight(id, insightData);
      setInsights((prevState) =>
        prevState.map((insight) => {
          return insight.id === Number(id) ? updatedInsight : insight;
        })
      );
      setLoaded(false);
      setUpdated(true);
      history.push("/insights");
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg) {
        setModerationError(msg);
      }
    }
  };

  return (
    <>
      <Switch>
        <Route path="/insights/new">
          <InsightCreate handleCreate={handleCreate} moderationError={moderationError} />
        </Route>
        <Route path="/insights/:id/edit">
          <InsightEdit insights={insights} handleUpdate={handleUpdate} moderationError={moderationError} />
        </Route>
        <Route path="/insights/:id">
          <InsightDetail
            getOneInsight={getOneInsight}
            handleDelete={handleDelete}
            setInsightsLoaded={setLoaded}
          />
        </Route>
        <Route path="/insights">
          <Insights
            openDelete={openDelete}
            onDelete={onDelete}
            handleDeleteClose={handleDeleteClose}
            handleDeleteOpen={handleDeleteOpen}
            loaded={loaded}
            updated={updated}
            insights={insights}
            handleDelete={handleDelete}
            setLoaded={setLoaded}
            initialLoaded={initialLoaded}            
          />
        </Route>
      </Switch>
    </>
  );
}
