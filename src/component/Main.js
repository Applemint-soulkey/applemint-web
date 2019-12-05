import React, { useState, createRef, useEffect } from "react";
import {
  Box,
  Heading,
  Tabs,
  Divider,
  Text,
  Button,
  Flyout,
  RadioButton,
  Label,
  Card,
  Link,
  Spinner
} from "gestalt";
import "gestalt/dist/gestalt.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import { typeList } from "../config/TypeList";
import { observer } from "mobx-react-lite";
import useStores from "../store/Common";

const Main = observer(() => {
  const { auth, article } = useStores();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRef, setFilterRef] = useState(() => createRef());

  useEffect(() => {
    article.firstLoad();
  }, []);

  const _handleFilterClick = event => {
    setFilterOpen(!filterOpen);
  };
  const _handleDismiss = event => {
    setFilterOpen(false);
  };

  const _handleTabChange = event => {
    setActiveTabIndex(event.activeTabIndex);
    switch (event.activeTabIndex) {
      case 0:
        article.setState("new");
        break;
      case 1:
        article.setState("keep");
        break;
      default:
        article.setState("new");
        break;
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="start"
        alignItems="baseline"
        margin={3}
      >
        <Heading size="md">APPLEMINT</Heading>
        <Box marginLeft={7} flex="grow">
          <Tabs
            tabs={[
              { text: "New Articles", href: "#" },
              { text: "Read Laters", href: "#" }
            ]}
            activeTabIndex={activeTabIndex}
            onChange={_handleTabChange}
          />
        </Box>
        <Box>
          <Box display="inlineBlock" ref={filterRef} margin={1}>
            <Button
              accessibilityExpanded={!!filterOpen}
              accessibilityHaspopup
              onClick={_handleFilterClick}
              text="Filter"
            ></Button>
          </Box>
          <Box display="inlineBlock" margin={1}>
            <Button text="Refresh" onClick={() => article.refresh()} />
          </Box>
          <Box display="inlineBlock" margin={1}>
            <Button
              text="Log Out"
              onClick={() => {
                auth.logout();
                article.resetArticles();
              }}
            />
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        padding={3}
        display="flex"
        alignItems="center"
        justifyContent="start"
      >
        <Text size="xl" weight="bold">
          {"Remain Items: " + article.totalSize}
        </Text>
      </Box>
      <Box padding={3} display="flex" direction="column">
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={() => article.loadMore()}
          hasMore={article.hasMore}
          loader={
            <Box key="spinner" margin={2}>
              <Spinner show={true} accessibilityLabel="load-more" />
            </Box>
          }
        >
          {article.articles.map((value, index) => {
            return (
              <Box
                key={index}
                marginTop={1}
                padding={2}
                column={12}
                color="lightGray"
                shape="rounded"
              >
                <Card>
                  <Box display="flex" alignItems="end">
                    <Box flex="grow" column={10}>
                      <Link
                        href={
                          value.url.includes("https:")
                            ? value.url
                            : "https://" + value.url
                        }
                        target="blank"
                      >
                        <Heading size="xs">
                          {value.textContent === ""
                            ? value.host
                            : value.textContent}
                        </Heading>
                        <Text>{value.url}</Text>
                      </Link>
                    </Box>
                    <Box margin={1}>
                      <Button
                        color="red"
                        size="sm"
                        text="Remove"
                        onClick={() => {
                          article.removeArticle(value.fb_id);
                          if (article.articles.length < article.loadSize) {
                            article.loadMore();
                          }
                          toast(({ closeToast }) => (
                            <Box>
                              <Box
                                padding={1}
                                display="flex"
                                justifyContent="center"
                                direction="column"
                                marginBottom={3}
                              >
                                <Text size="lg" weight="bold">
                                  {"'" +
                                    (value.textContent === ""
                                      ? value.host
                                      : value.textContent) +
                                    "' is Deleted"}
                                </Text>
                              </Box>
                              <Button
                                size="sm"
                                color="red"
                                text="UNDO"
                                onClick={() => {
                                  article.restoreArticle(value);
                                  closeToast();
                                }}
                              />
                            </Box>
                          ));
                        }}
                      />
                    </Box>
                    {activeTabIndex === 0 ? (
                      <Box margin={1}>
                        <Button
                          color="blue"
                          size="sm"
                          text="Keep"
                          onClick={() => article.keepArticle(value.fb_id)}
                        />
                      </Box>
                    ) : (
                      <Box />
                    )}
                  </Box>
                </Card>
              </Box>
            );
          })}
        </InfiniteScroll>
      </Box>
      {filterOpen && (
        <Flyout
          anchor={filterRef.current}
          idealDirection="down"
          onDismiss={_handleDismiss}
          size="xs"
          color="white"
        >
          <Box padding={3} top={true}>
            <Text weight="bold">Type</Text>
            <Box marginTop={4} role="list" display="flex" direction="column">
              {typeList.map((value, index) => {
                return (
                  <Box
                    key={value}
                    alignItems="center"
                    paddingY={1}
                    display="flex"
                    direction="row"
                  >
                    <RadioButton
                      checked={article.filter === value}
                      id={"type_" + value}
                      name="type"
                      onChange={() => article.setFilter(value)}
                      value={value}
                    />
                    <Box flex="grow">
                      <Label htmlFor={"type_" + value}>
                        <Box paddingX={2}>
                          <Text>{value}</Text>
                        </Box>
                      </Label>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Flyout>
      )}
      <ToastContainer position="bottom-right" hideProgressBar />
    </Box>
  );
});

export default Main;
