import React from "react";
import { Flyout, Box, Text, RadioButton, Label } from "gestalt";
import { typeList } from "../config/TypeList";
import "gestalt/dist/gestalt.css";

const Filter = (ref, handleDismiss, article) => {
  return (
    <Flyout
      anchor={ref}
      idealDirection="down"
      onDismiss={handleDismiss}
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
  );
};

export default Filter;
