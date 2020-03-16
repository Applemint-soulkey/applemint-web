import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Label,
  TextField,
  Text,
  SelectList,
  Button,
  Tooltip,
  Spinner
} from "gestalt";
import firebase from "firebase/app";
import "firebase/functions";
import "gestalt/dist/gestalt.css";

const BookmarkModal = props => {
  let toggle = props.toggle;
  let data = props.data;
  let collections = props.collections;

  const [title, settitle] = useState(
    data !== undefined ? data.textContent : ""
  );
  const [url, seturl] = useState(data !== undefined ? data.url : "");
  const [collection, setCollection] = useState();
  const [inputTag, setInputTag] = useState("");
  const [tags, setTags] = useState([]);
  const [waitForResponse, setWaitForResponse] = useState(false);

  useEffect(() => {
    for (let collection of collections) {
      if (data !== undefined && collection.label === data.type) {
        setCollection(collection.value);
      }
    }
    return () => {
      console.log("msg:: cleanup bookmark dialog");
    };
  }, [collections, data]);

  const _handleKeydown = target => {
    if (target.event.key === "Enter") {
      setTags([...tags, inputTag]);
      setInputTag("");
    }
  };

  const _removeTag = value => {
    setTags(tags.filter(item => item !== value));
  };

  const _sendCreateRaindrop = () => {
    setWaitForResponse(true);
    let articleData = {
      title: title,
      url: url,
      collection: collection,
      tags: tags
    };
    var createCall = firebase.functions().httpsCallable("createRaindrop");
    createCall(articleData).then(result => {
      setWaitForResponse(false);
      props.toggle(null);
      console.log(result.data);
    });
  };

  return (
    <Modal
      accessibilityCloseLabel="close"
      accessibilityModalLabel="View default padding and styling"
      heading="Bookmark"
      onDismiss={toggle}
      size="lg"
    >
      <Box padding={3} display="flex" direction="column">
        <Box marginBottom={2}>
          <Label htmlFor="title">
            <Text>Title</Text>
          </Label>
        </Box>
        <TextField
          id="title"
          placeholder="Article Title"
          value={title}
          onChange={({ value }) => settitle(value)}
        />
        <Box marginBottom={2}>
          <Label htmlFor="url">
            <Text>URL</Text>
          </Label>
        </Box>
        <TextField
          id="url"
          disabled={true}
          placeholder="Article URL"
          value={url}
          onChange={({ value }) => seturl(value)}
        />
        <Box marginBottom={2}>
          <Label htmlFor="collections">
            <Text>Collection</Text>
          </Label>
        </Box>
        <SelectList
          id="collection"
          name="collection"
          options={collections}
          onChange={({ value }) => {
            console.log(value.toString());
            setCollection(value.toString());
          }}
          value={collection}
        />
        <Box marginBottom={2}>
          <Label htmlFor="tags">
            <Text>Tags</Text>
          </Label>
        </Box>
        <TextField
          id="add_tags"
          placeholder="Add Article Tag"
          value={inputTag}
          onChange={({ value }) => setInputTag(value)}
          onKeyDown={_handleKeydown}
        />
        <Box
          marginTop={3}
          marginBottom={7}
          direction="row"
          display="flex"
          alignItems="start"
        >
          {tags.map((value, index) => {
            return (
              <Box margin={1} key={index}>
                <Tooltip inline text="Click to delete">
                  <Button
                    text={value}
                    size="sm"
                    color="gray"
                    onClick={() => _removeTag(value)}
                  />
                </Tooltip>
              </Box>
            );
          })}
        </Box>
        <Box margin={3}>
          <Spinner
            show={waitForResponse}
            accessibilityLabel="waitForResponse"
          />
        </Box>
        <Button
          text={"Save"}
          color="red"
          disabled={waitForResponse}
          onClick={() => _sendCreateRaindrop()}
        />
      </Box>
    </Modal>
  );
};

export default BookmarkModal;
