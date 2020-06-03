import React from "react";
import Select from "./Select";
import { FieldPlugin, wrapFieldsWithMeta } from "tinacms";
type SingleRelationProps = {
  input: any;
  field: {
    disabled?: boolean;
    label: string;
    noDataText: string;
    data: any[];
    itemProps: (...args: any[]) => any;
    filter: (...args: any[]) => any;
  };
  form: {
    getState: (...args: any[]) => any;
  };
};
const SingleRelation = ({ input, field, form }: SingleRelationProps) => {
  let { data } = field;
  const { values } = form.getState();
  if (field.filter) {
    data = data.filter((item) => field.filter(item, values));
  }
  const options = data.map((item) => field.itemProps(item));
  const selectOptions = [
    {
      key: null,
      label: "---",
    },
    ...options,
  ];
  const value = input.value.id ?? input.value;
  return (
    <>
      <Select
        input={{ ...input, value }}
        options={selectOptions}
        noDataText={field.noDataText}
      />
    </>
  );
};

const SingleRelationPlugin = wrapFieldsWithMeta(SingleRelation)

export const SingleRelationFieldPlugin: FieldPlugin = {
  Component: SingleRelationPlugin,
  name: "single-relation",
  __type: "field",
};
