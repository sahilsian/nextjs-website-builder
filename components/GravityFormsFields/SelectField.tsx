import { gql } from "@apollo/client";

import { SelectField as SelectFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";

export const SELECT_FIELD_FIELDS = gql`
  fragment SelectFieldFields on SelectField {
    id
    label
    description
    cssClass
    isRequired
    defaultValue
    choices {
      text
      value
    }
  }
`;

interface Props {
  field: SelectFieldType;
  fieldErrors: FieldError[];
}

export default function SelectField({ field, fieldErrors }: Props) {
  const { id, type, label, description, cssClass, isRequired, defaultValue, choices } = field;
  const htmlId = `field_${id}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || String(defaultValue);

  return (
    <div className={`select gfield gfield-${type} ${cssClass}`.trim()}>
      <label className="text-left text-sm" htmlFor={htmlId}>{label}</label>
      <select
        name={String(id)}
        id={htmlId}
        required={Boolean(isRequired)}
        value={value}
        defaultValue={'none'}
        className="w-full text-sm bg-transparent py-3 border-[#ffffff] border-b-2"
        onChange={event => {
          dispatch({
            type: ACTION_TYPES.updateSelectFieldValue,
            fieldValue: {
              id,
              value: event.target.value,
            },
          })
        }}
      >
        {choices?.map(choice =>
          <option key={choice?.value || ''} value={choice?.value || ''}>{choice?.text || ''}</option>
        )}
      </select>
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </div>
  );
}
