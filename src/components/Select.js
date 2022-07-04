export const Select = ({
    data, handleChange, name, label, labelFor,
    id, intent, message
}) => {
    return(
        <div className="bp4-form-group">
            <label className="bp4-label" htmlFor={labelFor}>{label}</label>
            <div className="bp4-form-content">
                <div className="bp4-input-group">
                <span className="bp4-icon bp4-icon-caret-down"></span>
                    <select 
                        name={name}
                        id={id}
                        className={"bp4-input " + intent}
                        onChange={handleChange}
                    >
                        <option value="">...</option>
                        {data.map((val, key) => {
                            return <option value={val.name} key={key}>{val.name}</option>
                        })}
                    </select>
                </div>
                {message !== null ? <div className="bp4-form-helper-text"><font color="red">{message}</font></div> : null}
                
            </div>
            
        </div>
    )
}