import {FormGroup, InputGroup } from "@blueprintjs/core";

export const FormInput = ({
    label,
    labelFor,
    helperText,
    type,
    placeholder,
    value,
    id,
    name,
    onChange,
    intent
}) => {
    return(
        <FormGroup
            label={label}
            labelFor={labelFor}
            helperText={helperText}
            intent={"danger"}
        >
            <InputGroup
                id={id}
                name={name}
                type={type}
                onChange={onChange}
                value={value}
                intent={intent}
                placeholder={placeholder}
            />
        </FormGroup>
    )
}