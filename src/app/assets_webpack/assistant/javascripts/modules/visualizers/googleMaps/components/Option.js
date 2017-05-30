import React, {PropTypes} from "react";
import Divider from "material-ui/Divider";
import Checkbox from "material-ui/Checkbox";
import RadioButton from "material-ui/RadioButton";
import {filterTypes as types, Option as OptionModel, optionModes as modes} from "../models";
import Padding from "../../../../components/Padding";
import EditableLabel from "../../../app/containers/EditableLabel";
import makePureRender from "../../../../misc/makePureRender";

const labelStyle = {
    fontSize: '0.9rem',
    color: 'rgba(0, 0, 0, 0.8)'
};

const countStyle = {
    fontSize: '0.8rem',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 'bold'
};

const dividerStyle = {
    clear: 'both'
};

const configStyles = {
    [modes.USER_DEFINED]: {},
    [modes.SELECT_ALWAYS]: {
        color: 'rgba(0, 0, 0, 0.3)'
    }
};

const Option = ({option, type, onSelect}) => {
    const {count, mode, skosConcept} = option;

    const label = <span>
    <EditableLabel uri={skosConcept.uri} label={skosConcept.label}/>
        {count !== null && <span style={countStyle}> ({count})</span>}
  </span>;

    return <div>
        <Padding space={2}>
            <div style={Object.assign({}, labelStyle, configStyles[mode])}>
                {type == types.CHECKBOX ?
                    <Checkbox
                        disabled={mode == modes.SELECT_ALWAYS}
                        onCheck={(_, isActive) => onSelect(isActive)}
                        checked={option.selected}
                        label={label}
                    /> :
                    <RadioButton
                        disabled={mode == modes.SELECT_ALWAYS}
                        value={skosConcept.uri}
                        onCheck={onSelect}
                        label={label}
                        checked={option.selected}
                    />}
            </div>
        </Padding>
        <Divider style={dividerStyle}/>
    </div>
};

Option.propTypes = {
    option: PropTypes.instanceOf(OptionModel).isRequired,
    type: PropTypes.oneOf([types.CHECKBOX, types.RADIO]).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default makePureRender(Option);
