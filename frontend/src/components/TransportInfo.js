const TransportInfo = ({
    address,
    legend,
    name,
    date,
    attn,
    uploads,
    instructions
}) => {
    return (
        <fieldset>
            <legend>{legend}</legend>
            <address>
                {name && <strong>{name}</strong>}
                {name && <br />}
                {address}
                <br />
                <abbr title='Attention'>Attn:</abbr>
                {attn}
                <br />
                {instructions}
            </address>
        </fieldset>
    );
};

export default TransportInfo;