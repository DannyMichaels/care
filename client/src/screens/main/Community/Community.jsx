// hooks
import { useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

// components
import Layout from "../../../layouts/Layout/Layout";
import ScrollToTopOnMount from "../../../components/Helpers/ScrollToTopOnMount";
import Div from "./styledCommunity";
import Users from "../../../components/CommunityComponents/Users";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Feed from "../../../components/CommunityComponents/Feed";

export default function Community({ usersAreLoading, allUsers }) {
  const [viewMode, setViewMode] = useState("comments");
  const theme = useTheme();
  const { breakpoints } = theme;

  const isLargeScreen = useMediaQuery(breakpoints.up("lg"));

  return (
    <Layout title="Community">
      <ScrollToTopOnMount />

      <Div>
        {!isLargeScreen && (
          <div className="top-view-btns">
            {viewMode === "comments" ? (
              <div className="link-2" onClick={() => setViewMode("likes")}>
                view likes
              </div>
            ) : (
              <div className="link-2" onClick={() => setViewMode("comments")}>
                view comments
              </div>
            )}
          </div>
        )}
        {!usersAreLoading ? (
          isLargeScreen && (
            <div className="separator-div" id="community-users">
              <Grid
                item
                xs={2}
                style={{
                  padding: "10px",
                }}
              >
                <Users usersAreLoading={usersAreLoading} allUsers={allUsers} />
              </Grid>
              <div className="separator" />
            </div>
          )
        ) : (
          <Grid item xs={3} />
        )}
        <Grid item xs={isLargeScreen ? 6 : 12}>
          {usersAreLoading ? (
            <>
              <p className="loading-title">Loading...</p>
              <LinearProgress style={{ margin: "50px auto", width: "30vw" }} />
            </>
          ) : isLargeScreen ? (
            <Feed
              items={allUsers}
              action="commented"
              name="Comments"
              attribute="comments"
              type="comment"
              justifyContent="center"
              textAlign="center"
            />
          ) : viewMode === "comments" ? (
            <Feed
              items={allUsers}
              action="commented"
              name="Comments"
              attribute="comments"
              type="comment"
            />
          ) : (
            <Feed
              items={allUsers}
              action="liked"
              name="Likes"
              attribute="liked_insights"
              type="like"
            />
          )}
        </Grid>
        {isLargeScreen && (
          <Grid
            item
            xs={3}
            className="separator-div"
            style={{ justifyContent: "flex-start" }}
          >
            <div className="separator" />
            <div style={{ marginLeft: "10px", padding: "10px" }}>
              <Feed
                name="Likes"
                items={allUsers}
                attribute="liked_insights"
                action="liked"
                type="like"
              />
            </div>
          </Grid>
        )}
      </Div>
    </Layout>
  );
}
