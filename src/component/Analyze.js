import React, { createRef, useState } from "react";
import {
  Modal,
  Text,
  Spinner,
  Box,
  Heading,
  Image,
  Button,
  Masonry,
  Mask,
  TextField,
  Tooltip
} from "gestalt";
import "gestalt/dist/gestalt.css";
import { toast } from "react-toastify";
import { Dropbox } from "dropbox";

const validFileRegex = /[\\/:*?""<>|]/;
const replaceFileName = (path, targetName) => {
  let pathBlocks = path.replace("\\", "/").split("/");
  let fileName = pathBlocks[pathBlocks.length - 1];
  let extension = fileName.slice(fileName.lastIndexOf("."));
  let saveTitle = targetName.replace(validFileRegex, "_");
  return saveTitle + extension;
};

const dapina = async (data, setSaveBtnEnabled) => {
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
          {"Send request for '" + data.title + "' contents."}
        </Text>
        <Text size="lg" weight="bold">
          Check your Dropbox!
        </Text>
      </Box>
    </Box>
  ));

  setSaveBtnEnabled(false);
  const savePrefixPath = "/test/";
  var dbx = new Dropbox({ accessToken: process.env.REACT_APP_DROPBOX_TOKEN });
  if (data.midiContents.length === 1) {
    //single
    let savePath = replaceFileName(data.midiContents[0], data.title);
    dbx
      .filesSaveUrl({
        path: savePrefixPath + savePath,
        url: data.midiContents[0]
      })
      .then(result => {
        console.log(result.tag);
      });
  } else {
    //multi
    let folderName = data.title.replace(validFileRegex, "_");
    for (let i = 0; i < data.midiContents.length; i++) {
      let fileName = String(i + 1).padStart(4, "0");
      let targetPath =
        savePrefixPath +
        folderName +
        "/" +
        replaceFileName(data.midiContents[i], fileName);
      await dbx.filesSaveUrl({
        path: targetPath,
        url: data.midiContents[i]
      });
    }
  }
};

const AnalyzeModal = props => {
  let data = props.data;
  let toggle = props.toggle;
  let setter = props.setter;
  const [editFlag, setEditFlag] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [saveBtnEnabled, setSaveBtnEnabled] = useState(true);
  const scrollContainerRef = createRef();
  const renderMasonry = ({ data }) => (
    <Box>
      <Mask shape="rounded">
        <Image
          alt="Masonry"
          color="rgb(111,91,77)"
          naturalHeight={200}
          naturalWidth={300}
          src={data.url}
        />
      </Mask>
      <Text>{data.name}</Text>
    </Box>
  );
  console.log(data);

  const _handleEditTitleChanged = ({ value }) => {
    setEditTitle(value);
    setter({
      ...data,
      title: value
    });
  };

  return (
    <Modal
      accessibilityCloseLabel="close"
      accessibilityModalLabel="View default padding and styling"
      heading="Analyzed Data"
      onDismiss={toggle}
      size="lg"
    >
      {data !== undefined && data !== null ? (
        <Box padding={4} display="flex" direction="column">
          <Box marginBottom={3}>
            <Box display="flex" direction="row">
              <Heading size="xs">Title</Heading>
              <Box marginStart={4}>
                <Tooltip inline text="It's not applied to Cloud Storage.">
                  <Button
                    size="sm"
                    color="blue"
                    text="Edit"
                    onClick={() => {
                      setEditTitle(data.title);
                      setEditFlag(!editFlag);
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <Box margin={2}>
              {editFlag ? (
                <TextField
                  id="editTitle"
                  placeholder="Edit Title"
                  value={editTitle}
                  onChange={_handleEditTitleChanged}
                />
              ) : (
                <Text size="xl" weight="bold">
                  {data.title}
                </Text>
              )}
            </Box>
          </Box>
          <Box marginBottom={3}>
            <Box display="flex" alignItems="center" direction="row">
              <Box>
                <Heading size="xs">Meida ({data.midiContents.length})</Heading>
              </Box>
              <Box marginStart={4}>
                <Button
                  size="sm"
                  color="blue"
                  text="Save"
                  disabled={!saveBtnEnabled}
                  onClick={() => dapina(data, setSaveBtnEnabled)}
                />
              </Box>
              <Box marginStart={4}>{}</Box>
            </Box>
            <Box
              display="flex"
              height={300}
              marginTop={3}
              overflow="auto"
              ref={scrollContainerRef}
            >
              <Masonry
                comp={renderMasonry}
                items={data.midiContents.map(value => ({
                  url: value,
                  name: value.slice(value.lastIndexOf("/") + 1)
                }))}
                minCols={2}
                scrollContainer={() => scrollContainerRef.current}
              />
            </Box>
          </Box>

          {/* <Heading size="xs">External Links</Heading>
          {data.extContents.map((value, index) => {
            return (
              <Link href={value} target="blank">
                <Text key={index}>{value}</Text>
              </Link>
            );
          })} */}
        </Box>
      ) : (
        <Box key="spinner" margin={2}>
          {data !== null ? (
            <Spinner show={true} accessibilityLabel="load-more" />
          ) : (
            <Text>Analyzation is Fail..</Text>
          )}
        </Box>
      )}
    </Modal>
  );
};

export default AnalyzeModal;
